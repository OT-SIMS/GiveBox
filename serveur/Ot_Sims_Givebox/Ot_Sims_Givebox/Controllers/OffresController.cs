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

namespace Ot_Sims_Givebox.Controllers
{
    public class OffresController : ApiController
    {
        private ModelContainer db = new ModelContainer();

        // GET: api/Offres
        public IQueryable<Offre> GetOffreSet()
        {
            return db.OffreSet;
        }

        //GET LOCALISATION : api/Offres/longitude/lattitude/rayon
        [ResponseType(typeof(Offre))]
        public IHttpActionResult GetOffre(double lgt, double latt, double r = 1)
        {
            List<Offre> resultat = new List<Offre>();

            try
            {
                foreach (var offres3 in db.OffreSet)
                {
                    if ((lgt - offres3.Longitude) * (lgt - offres3.Longitude) + (latt - offres3.Latitude) * (latt - offres3.Latitude) <= r * r)
                    {
                        resultat.Add(offres3);
                    }
                }
                return Ok(resultat);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        // GET: api/Offres/5
        [ResponseType(typeof(Offre))]
        public async Task<IHttpActionResult> GetOffre(string id)
        {
            int idint;
            try
            {
                if (Int32.TryParse(id, out idint))
                {
                    Offre offre = await db.OffreSet.FindAsync(idint);
                    if (offre == null)
                    {
                        var OffreFiltre2 = from offres2 in db.OffreSet
                                           where offres2.Titre.Contains(id) | offres2.Description.Contains(id)
                                           select offres2;
                        return Ok(OffreFiltre2);
                        //return NotFound();
                    }

                    return Ok(offre);
                }
                else
                {
                    IQueryable<Offre> OffreFiltre = null;
                    Dictionary<int, Offre> dictionnaire = new Dictionary<int, Offre>();
                    if (id.Contains(' '))
                    {
                        string[] idparts = id.Split(' ');
                        bool premiermot = true;
                        foreach (string idpart in idparts)
                        {
                            char s = 's';
                            char x = 'x';
                            if (s == idpart[idpart.Length - 1] | x == idpart[idpart.Length - 1])
                            {
                                string idpart2 = idpart.Substring(0, idpart.Length - 1);
                                OffreFiltre = from offres in db.OffreSet
                                              where offres.Titre.Contains(idpart2) | offres.Description.Contains(idpart2)
                                              select offres;
                                foreach (Offre offreF in OffreFiltre)
                                {
                                    if (dictionnaire.ContainsKey(offreF.Id))
                                    {
                                        if (idpart.Length >= 2)
                                        {
                                            offreF.prio = offreF.prio + 1;
                                        }
                                    }
                                    else
                                    {
                                        dictionnaire.Add(offreF.Id, offreF);
                                        if (idpart.Length >= 2)
                                        {
                                            if (premiermot == true)
                                            {
                                                offreF.prio = offreF.prio + 2;
                                            }
                                            else
                                            {
                                                offreF.prio = offreF.prio + 1;
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                OffreFiltre = from offres in db.OffreSet
                                              where offres.Titre.Contains(idpart) | offres.Description.Contains(idpart)
                                              select offres;
                                foreach (Offre offreF in OffreFiltre)
                                {
                                    if (dictionnaire.ContainsKey(offreF.Id))
                                    {
                                       offreF.prio = offreF.prio + 1;
                                    }
                                    else
                                    {
                                        dictionnaire.Add(offreF.Id, offreF);
                                    }
                                }
                              
                            }
                            premiermot = false;
                        }
                        return Ok(dictionnaire);
                    }
                    else
                    {
                        char s = 's';
                        char x = 'x';
                        if (s == id[id.Length - 1] | x == id[id.Length - 1])
                        {
                            id = id.Substring(0, id.Length - 1);
                            OffreFiltre = from offres in db.OffreSet
                                              where offres.Titre.Contains(id) | offres.Description.Contains(id)
                                              select offres;
                        }
                        else
                        {
                           OffreFiltre = from offres in db.OffreSet
                                              where offres.Titre.Contains(id) | offres.Description.Contains(id)
                                              select offres;
                        }

                        return Ok(OffreFiltre);
                    }

                }
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