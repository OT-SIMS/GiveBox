DELETE FROM [dbo].FichierTypeSet
DBCC CHECKIDENT ('dbo.FichierTypeSet',RESEED, 0);
DELETE FROM [dbo].FichierSet
DBCC CHECKIDENT ('dbo.FichierSet',RESEED, 0);
DELETE FROM [dbo].OffreSet
DBCC CHECKIDENT ('dbo.OffreSet',RESEED, 0);
DELETE FROM [dbo].CategorieSet
DBCC CHECKIDENT ('dbo.CategorieSet',RESEED, 0);
DELETE FROM [dbo].utilisateurSet
DBCC CHECKIDENT ('dbo.utilisateurSet',RESEED, 0);


bulk INSERT [dbo].CategorieSet
from 'C:\Users\Simon\Documents\GitHub\GiveBox\sqlRequest\importCategorie.txt'
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = ',' , ROWTERMINATOR = '\n');

bulk INSERT [dbo].fichierTypeSet
from 'C:\Users\Simon\Documents\GitHub\GiveBox\sqlRequest\importFichierType.txt'
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = ',' , ROWTERMINATOR = '\n');

bulk INSERT [dbo].UtilisateurSet
from 'C:\Users\Simon\Documents\GitHub\GiveBox\sqlRequest\importUtilisateur.txt'
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = ',' , ROWTERMINATOR = '\n');

select * from [dbo].utilisateurSet;
 
 