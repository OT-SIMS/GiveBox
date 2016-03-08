
declare @path varchar(max)
declare @sql varchar(max)
set @path = 'C:\Users\Simon\Documents'

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



set @sql = '
bulk INSERT [dbo].CategorieSet
from '''+@path +'\GitHub\GiveBox\sqlRequest\importCategorie.txt''
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = '','' , ROWTERMINATOR = ''\n'');

bulk INSERT [dbo].fichierTypeSet
from '''+@path+'\GitHub\GiveBox\sqlRequest\importFichierType.txt''
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = '','' , ROWTERMINATOR = ''\n'');

bulk INSERT [dbo].UtilisateurSet
from '''+@path+'\GitHub\GiveBox\sqlRequest\importUtilisateur.txt''
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = '','' , ROWTERMINATOR = ''\n'');

bulk INSERT [dbo].OffreSet
from '''+@path +'\GitHub\GiveBox\sqlRequest\importOffre.txt''
with(FIRSTROW = 2, keepnulls, FIELDTERMINATOR = '','' , ROWTERMINATOR = ''\n'');'

exec(@sql)
select * from [dbo].OffreSet;
 
 