using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ot_Sims_Givebox;
using Ot_Sims_Givebox.Controllers;
using Ot_Sims_Givebox.Models;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;

namespace Ot_Sims_Givebox.Tests.Controllers
{
    [TestClass]
    public class OffresControllerTest
    {
        [TestMethod]
        public void GetAll()
        {
            // Disposer
            OffresController controller = new OffresController();

            // Agir
            System.Linq.IQueryable<Offre> result = controller.GetOffreSet();

            // Affirmer
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task GetById()
        {
            // Disposer
            OffresController controller = new OffresController();

            // Agir
            var result = await controller.GetOffre("1");

            // Affirmer
            Assert.IsNotNull(result);
            //Assert.AreEqual(200, result.StatusCode);
            //Assert.IsInstanceOfType(result.Content, typeof(Offre));
        }


    }
}

