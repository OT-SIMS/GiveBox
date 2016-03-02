using Ot_Sims_Givebox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;

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
            string userId = User.Identity.GetUserId();
            var utilisateurs = db.UtilisateurSet.Where(u => u.UserId.Equals(userId));
            if (utilisateurs.Any())
            {
                return Ok(utilisateurs.First());
            }
            else
            {
                return NotFound();
            }
        }

        public IHttpActionResult postUtilisateur([FromBody] UserInfo userInfo)
        {
            try
            {
                string userId = User.Identity.GetUserId();
                var utilisateurs = db.UtilisateurSet.Where(u => u.UserId.Equals(userId));
                Utilisateur utilisateur = null;
                if (!utilisateurs.Any())
                {
                    utilisateur = new Utilisateur() { UserId = userId };
                    db.UtilisateurSet.Add(utilisateur);
                }
                else
                {
                    utilisateur = utilisateurs.First();
                }
                userInfo.assign(utilisateur);


                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

        }
    }
}