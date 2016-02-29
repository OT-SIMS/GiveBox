namespace Ot_Sims_Givebox.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Ot_Sims_Givebox.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<Ot_Sims_Givebox.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Ot_Sims_Givebox.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //string email =  "feitor@hotmail.fr";
            //    context.Users.AddOrUpdate(
            //      p => p.Email,
            //      new ApplicationUser { Email = email, UserName = email}

            //    );
            //
        }
    }
}
