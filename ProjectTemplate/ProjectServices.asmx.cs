using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace ProjectTemplate
{
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	[System.Web.Script.Services.ScriptService]

	public class ProjectServices : System.Web.Services.WebService
	{
		////////////////////////////////////////////////////////////////////////
		///replace the values of these variables with your database credentials
		////////////////////////////////////////////////////////////////////////
		private string dbID = "group5";
		private string dbPass = "!!Cis440";
		private string dbName = "group5";
		////////////////////////////////////////////////////////////////////////
		
		////////////////////////////////////////////////////////////////////////
		///call this method anywhere that you need the connection string!
		////////////////////////////////////////////////////////////////////////
		private string getConString() {
			return "SERVER=107.180.1.16; PORT=3306; DATABASE=" + dbName+ "; UID=" + dbID + "; PASSWORD=" + dbPass;
		}
		////////////////////////////////////////////////////////////////////////



		/////////////////////////////////////////////////////////////////////////
		//don't forget to include this decoration above each method that you want
		//to be exposed as a web service!
		[WebMethod(EnableSession = true)]
		/////////////////////////////////////////////////////////////////////////
		public string TestConnection()
		{
			try
			{
				string testQuery = "select * from Users";

				////////////////////////////////////////////////////////////////////////
				///here's an example of using the getConString method!
				////////////////////////////////////////////////////////////////////////
				MySqlConnection con = new MySqlConnection(getConString());
				////////////////////////////////////////////////////////////////////////

				MySqlCommand cmd = new MySqlCommand(testQuery, con);
				MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
				DataTable table = new DataTable();
				adapter.Fill(table);
				return "Success!";
			}
			catch (Exception e)
			{
				return "Something went wrong, please check your credentials and db name and try again.  Error: "+e.Message;
			}
		}

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public bool LogOn(string uid, string pass)
        {
            //we return this flag to tell them if they logged in or not
            bool success = false;

            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = getConString();
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlSelect = "SELECT userID FROM Users WHERE userName=@idValue and userPassword=@passValue";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(uid));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's 
            //a legit account
            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id and admin status in the session
                //so we can check those values later on other method calls to see if they 
                //are 1) logged in at all, and 2) and admin or not
                Session["userID"] = sqlDt.Rows[0]["userID"];
                success = true;
            }
            //return the result!
            return success;
        }

        [WebMethod(EnableSession = true)]
        public bool RequestAccount(string uid, string pass, string firstName, string lastName, string phone, string email,
            string address, string city, string state, string zip)
        {
            bool success = false;
            string sqlConnectString = getConString();
            //string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings['myDB'].ConnectionString;
            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row.
            string sqlSelect = "insert into Users (userFirstName, userLastName, userAddress, userCity, userState, " +
                "userZipCode, userPhoneNumber, userName, userPassword, userEmail) " +
                "values(@fnameValue, @lnameValue, @addressValue, @cityValue, @stateValue, @zipValue, @phoneValue, " +
                "@idValue, @passValue, @emailValue); SELECT LAST_INSERT_ID();";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@fnameValue", HttpUtility.UrlDecode(firstName));
            sqlCommand.Parameters.AddWithValue("@lnameValue", HttpUtility.UrlDecode(lastName));
            sqlCommand.Parameters.AddWithValue("@addressValue", HttpUtility.UrlDecode(address));
            sqlCommand.Parameters.AddWithValue("@cityValue", HttpUtility.UrlDecode(city));
            sqlCommand.Parameters.AddWithValue("@stateValue", HttpUtility.UrlDecode(state));
            sqlCommand.Parameters.AddWithValue("@zipValue", HttpUtility.UrlDecode(zip));
            sqlCommand.Parameters.AddWithValue("@phoneValue", HttpUtility.UrlDecode(phone));
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(uid));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));
            sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));

            //this time, we're not using a data adapter to fill a data table.  We're just
            //opening the connection, telling our command to "executescalar" which says basically
            //execute the query and just hand me back the number the query returns (the ID, remember?).
            //don't forget to close the connection!
            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                success = true;
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
            return success;
        }

        //EXAMPLE OF A SELECT, AND RETURNING "COMPLEX" DATA TYPES
        [WebMethod(EnableSession = true)]
        public Job[] GetJobs()
        {
            //check out the return type.  It's an array of Account objects.  You can look at our custom Account class in this solution to see that it's 
            //just a container for public class-level variables.  It's a simple container that asp.net will have no trouble converting into json.  When we return
            //sets of information, it's a good idea to create a custom container class to represent instances (or rows) of that information, and then return an array of those objects.  
            //Keeps everything simple.

            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
           
                DataTable sqlDt = new DataTable("jobs");

                string sqlConnectString = getConString();
                string sqlSelect = "select jobID, jobOwner, jobName, jobLocationState, jobLocationCity, jobDescription, jobWage, jobDate, jobTaker, jobExperienceLevel from PostedJobs";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                List<Job> jobs = new List<Job>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                   
                        jobs.Add(new Job
                        {
                            jobID = Convert.ToInt32(sqlDt.Rows[i]["jobID"]),
                            jobOwner = sqlDt.Rows[i]["userid"].ToString(),
                            jobName = sqlDt.Rows[i]["jobName"].ToString(),
                            jobLocationState = sqlDt.Rows[i]["jobLocationState"].ToString(),
                            jobLocationCity = sqlDt.Rows[i]["jobLocationCity"].ToString(),
                            jobDescription = sqlDt.Rows[i]["jobDescription"].ToString(),
                            jobWage= sqlDt.Rows[i]["jobWage"].ToString(),
                            jobDate = sqlDt.Rows[i]["jobDate"].ToString(),
                            jobTaker = sqlDt.Rows[i]["jobTaker"].ToString(),
                            jobExperienceLevel = sqlDt.Rows[i]["jobExperienceLevel"].ToString()
                        });
                    
                   
                }
                //convert the list of accounts to an array and return!
                return jobs.ToArray();
            
            
        }


    }
}
