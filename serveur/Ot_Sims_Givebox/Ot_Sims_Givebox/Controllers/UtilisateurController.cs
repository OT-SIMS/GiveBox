using Ot_Sims_Givebox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using Ot_Sims_Givebox.helper;
using System.Net.Http;
using System.Net;

namespace Ot_Sims_Givebox.Controllers
{
    [Authorize]
    [RoutePrefix("api/utilisateur")]
    public class UtilisateurController : ApiController
    {
        public struct UserInfo
        {
            string nom;
            string prenom;
            string telephone;
            DateTime dateNaissance; 
            public void assign(Utilisateur u)
            {
                u.Nom = nom;
                u.Prenom = prenom;
                u.Telephone = telephone;
                u.DateNaissance = dateNaissance;
            }
        }
        private ModelContainer db = new ModelContainer();

        [Route("Offres")]
        public IHttpActionResult getOffre()
        {
            var utilisateur = UserHelper.getUser(User, db);
            if (utilisateur == null)
            {
                return ResponseMessage(new HttpResponseMessage(HttpStatusCode.NoContent));
            }
            else
            {
                IQueryable<Offre> request = null;
                request = from offres in db.OffreSet where offres.UtilisateurId.Equals(utilisateur.Id) select offres; // sélectionne toutes les offres de l'user
                return Ok(request);
            }
        }



        public IHttpActionResult getUtilisateur()
        {
            var utilisateur = UserHelper.getUser(User, db);
            if (utilisateur == null)
            {
                return ResponseMessage(new HttpResponseMessage(HttpStatusCode.NoContent));
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

        [AllowAnonymous]
        //option handler
        public IHttpActionResult Options()
        {
            return Ok();
        }
    }
}