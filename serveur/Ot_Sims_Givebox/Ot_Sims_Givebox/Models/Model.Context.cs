﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré à partir d'un modèle.
//
//     Des modifications manuelles apportées à ce fichier peuvent conduire à un comportement inattendu de votre application.
//     Les modifications manuelles apportées à ce fichier sont remplacées si le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ot_Sims_Givebox.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ModelContainer : DbContext
    {
        public ModelContainer()
            : base("name=ModelContainer")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Utilisateur> UtilisateurSet { get; set; }
        public virtual DbSet<Offre> OffreSet { get; set; }
        public virtual DbSet<Categorie> CategorieSet { get; set; }
        public virtual DbSet<Fichier> FichierSet { get; set; }
        public virtual DbSet<FichierType> FichierTypeSet { get; set; }
    }
}