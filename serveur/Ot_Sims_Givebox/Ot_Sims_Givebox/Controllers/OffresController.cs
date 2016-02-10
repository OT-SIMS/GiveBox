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
        private CancellationToken id;

        // GET: api/Offres
        public IQueryable<Offre> GetOffreSet()
        {
            return db.OffreSet;
        }

        // GET: api/Offres/5
        [ResponseType(typeof(Offre))]
        public async Task<IHttpActionResult> GetOffre(int id)
        {
            Offre offre = await db.OffreSet.FindAsync(id);
            if (offre == null)
            {
                return NotFound();
            }

            return Ok(offre);
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
        public async Task<IHttpActionResult> PostOffre(Offre offre)
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
        // RECUPERATION DE L'IMAGE
        public async Task<List<string>> SaveFile()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);
            List<string> ret = new List<string>();
            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                // This illustrates how to get the file names.

                foreach (MultipartFileData file in provider.FileData)
                {
                    ret.Add(file.LocalFileName);
                    //Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                    //Trace.WriteLine("Server file path: " + file.LocalFileName);
                }
                return ret;
            }
            catch (System.Exception e)
            {
                return null;
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
    }
}