﻿using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ot_Sims_Givebox;
using Ot_Sims_Givebox.Controllers;

namespace Ot_Sims_Givebox.Tests.Controllers
{
    [TestClass]
    public class OffresControllerTest
    {
        [TestMethod]
        public void FileUpload()

        {
            // Disposer
            HomeController controller = new HomeController();

            // Agir
            ViewResult result = controller.Index() as ViewResult;

            // Affirmer
            Assert.IsNotNull(result);
            Assert.AreEqual("Home Page", result.ViewBag.Title);
        }
    }
}
