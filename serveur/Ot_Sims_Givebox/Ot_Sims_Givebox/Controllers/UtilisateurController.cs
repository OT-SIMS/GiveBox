using Ot_Sims_Givebox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using Ot_Sims_Givebox.helper;

namespace Ot_Sims_Givebox.Controllers
{
    [Authorize]
    public class UtilisateurController : ApiController
    {
        public struct UserInfo
        {
            string nom;
            public void assign(Utilisateur u)
            {
                u.Nom = nom;
            }
        }
        private ModelContainer db = new ModelContainer();

        public IHttpActionResult getUtilisateur()
        {
            var utilisateur = UserHelper.getUser(User, db);
            if (utilisateur == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(utilisateur);
            }
        }

        public IHttpActionResult postUtilisateur([FromBody] UserInfo userInfo)
        {
            try
            {

                Utilisateur utilisateur = UserHelper.getUser(User, db);
                if (utilisateur == null)
                {
                    utilisateur = new Utilisateur() { UserId = User.Identity.GetUserId() };
                    db.UtilisateurSet.Add(utilisateur);
                }
                userInfo.assign(utilisateur);
                db.SaveChanges();
                return Ok(utilisateur);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

        }
    }
}