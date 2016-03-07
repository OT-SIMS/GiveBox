using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Ot_Sims_Givebox.Models;
using System.Web;
using Ot_Sims_Givebox.helper;

namespace Ot_Sims_Givebox.Controllers
{
    [Authorize]
    public class OffresController : ApiController
    {
        private ModelContainer db = new ModelContainer();

        //// GET: api/Offres
        //public IQueryable<Offre> GetOffreSet()
        //{
        //    return db.OffreSet;
        //}

        //GET LOCALISATION : api/Offres?motcles=""&categorie=""&lgt=""&latt=""
        [AllowAnonymous]
        [ResponseType(typeof(Offre))]
        public IHttpActionResult GetOffre(string motcles=null, string categorie=null, double lgt = 5000, double latt = 5000, double r = 1)
        {
            try 
            {
                IQueryable<Offre> request = null;
                if (categorie == null)
                {
                    request = from offres in db.OffreSet select offres;
                }
                else
                {
                    request = from offres in db.OffreSet where offres.Categorie.Nom.Equals(categorie) select offres; // sélectionne toutes les offres de la catégorie précisée
                }

                if (lgt != 5000 && latt != 5000) // Si l'user précise sa géoloc
                {
                    request = request.Where(offres3 => (lgt - offres3.Longitude) * (lgt - offres3.Longitude) + (latt - offres3.Latitude) * (latt - offres3.Latitude) <= r * r); // Filtre les offres selon la position
                }

                if (motcles != null) // Si l'user précise aussi des mots clés
                {
                    double seuil = 0.7; // Seuil de différence entre mot clé rentré par l'user et titre des offres (sert de prio pour le tri, à modifier si besoin)
                    Dictionary<int, Offre> dictionnaire = new Dictionary<int, Offre>();

                    string[] idparts = motcles.Split(' '); 
                    bool premiermot = true; // Gère les priorités (si c'est le premier mot, priorité plus grande)
                    foreach (string idpart in idparts)
                    {
                        foreach (Offre offre in request)
                        {
                            string[] id2s = offre.Titre.Split(' ');
                            foreach (string id2 in id2s) // On compare chaque mot clé rentré par l'user à chaque bout de titre de chaque offre présente dans la request
                            {
                                double coef = Levenshtein.ComputeCorrelation(idpart, id2, false); // Compare les deux mots
                                if (coef > seuil)
                                {
                                    if (!dictionnaire.ContainsKey(offre.Id)) // Si l'offre dont la partie du titre vient d'être comparée au mot clé n'a jamais été vue
                                    {
                                        if (premiermot == true)
                                        {
                                            offre.prio = coef * 2;
                                        }
                                        else                                 // Gestion priorité
                                        {
                                            offre.prio = coef;
                                        }
                                        dictionnaire.Add(offre.Id, offre); // On ajoute l'offre au dictionnaire
                                    }
                                    else                                   // Si l'offre était déjà dans le dico -> on augmente la prio
                                    {
                                        offre.prio = offre.prio + coef;
                                    }
                                }
                            }
                        }
                        premiermot = false;
                    }
                    return Ok(dictionnaire.ToList());
                }
                if (request != null)
                {
                    return Ok(request.ToList());
                }
                else
                {
                    return Ok(new List<Offre>());
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        // GET: api/Offres/5
        [AllowAnonymous]

        [ResponseType(typeof(Offre))]
        public async Task<IHttpActionResult> GetOffre(int id)
        {
            try
            {
                Offre offre = await db.OffreSet.FindAsync(id);
                return Ok(offre);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        // PUT: api/Offres/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutOffre(int id, Offre offre)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != offre.Id)
            {
                return BadRequest();
            }

            db.Entry(offre).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OffreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Offres
        [ResponseType(typeof(Offre))]
        public async Task<IHttpActionResult> PostOffre([FromBody] Offre offre)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                db.OffreSet.Add(offre);
                await db.SaveChangesAsync();
                //Offre offre2 = await db.OffreSet.FindAsync(offre.Id);
                return CreatedAtRoute("DefaultApi", new { id = offre.Id }, offre);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

        }

        // DELETE: api/Offres/5
        [ResponseType(typeof(Offre))]
        public async Task<IHttpActionResult> DeleteOffre(int id)
        {
            Offre offre = await db.OffreSet.FindAsync(id);
            if (offre == null)
            {
                return NotFound();
            }

            db.OffreSet.Remove(offre);
            await db.SaveChangesAsync();

            return Ok(offre);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OffreExists(int id)
        {
            return db.OffreSet.Count(e => e.Id == id) > 0;
        }

        //option handler
        public HttpResponseMessage Options()
        {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }
    }
}