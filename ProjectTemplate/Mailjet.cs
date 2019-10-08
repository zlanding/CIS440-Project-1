using Mailjet.Client;
using Mailjet.Client.Resources;
using System;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace ProjectTemplate
{
    public class Mailjet
    {
        public static void SendInitialEmail(string email, string name)
        {
            RunAsync(email, name).Wait();
        }
        static async Task RunAsync(string email, string name)
        {
            MailjetClient client = new MailjetClient("d20c0582b895821465c397eacb9bcabc", "13213a24a6ddea783024f7cd71c47234")
            {
                Version = ApiVersion.V3_1,
            };
            MailjetRequest request = new MailjetRequest
            {
                Resource = Send.Resource,
            }
             .Property(Send.Messages, new JArray {
     new JObject {
      {
       "From",
       new JObject {
        {"Email", "kvohra2@asu.edu"},
        {"Name", "Kunal"}
       }
      }, {
       "To",
       new JArray {
        new JObject {
         {
          "Email",
          email
         }, {
          "Name",
          name
         }
        }
       }
      }, {
       "Subject",
       "Welcome to Jobs4U " + name
      }, {
       "TextPart",
       "My first Mailjet email"
      }, {
       "HTMLPart",
        $"<h3>Dear {name}, welcome to Jobs4U! I hope you find this site useful."
         }, {
       "CustomID",
       "AppGettingStartedTest"
      }
     }
             });

            /*MailjetResponse response = await client.PostAsync(request);
            if (response.IsSuccessStatusCode);
            {
                Console.WriteLine(string.Format("Total: {0}, Count: {1}\n", response.GetTotal(), response.GetCount()));
                Console.WriteLine(response.GetData());
            }
            else
            {
                Console.WriteLine(string.Format("StatusCode: {0}\n", response.StatusCode));
                Console.WriteLine(string.Format("ErrorInfo: {0}\n", response.GetErrorInfo()));
                Console.WriteLine(response.GetData());
                Console.WriteLine(string.Format("ErrorMessage: {0}\n", response.GetErrorMessage()));
            }*/
        }
    }
}