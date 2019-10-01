using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace jobmanager
{
    public class Job
    {
        //this is just a container for all info related
        //to an account.  We'll simply create public class-level
        //variables representing each piece of information!
        public int jobID;
        public string jobOwner;
        public string jobName;
        public string jobLocationState;
        public string jobLocationCity;
        public string jobDescription;
        public string jobWage;
        public string jobDate;
        public string jobTaker;
        public string jobExperienceLevel;
    }
}
