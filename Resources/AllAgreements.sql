declare @date date = '<calculateDate>';

DECLARE @resultQuery nvarchar(max)

SET @resultQuery=(select 
	'{"groupId":"'+convert(nvarchar(max),Temp1.agreement_id,-1) +'"'
	+',"DocumentName":"'+REPLACE(agr.name,'"','\"')+' №'+REPLACE(agr.[key],'"','\"')+' от '+convert(nvarchar(max),[date],2)+'"'
	+',"ContragentName":"'+	REPLACE(c.name,'"','\"') +'"'
	+',"FirstLevel":"'+isnull(FL.name,'Не указан')+'"'
	+',"SecondLevel":"'+isnull(SL.name,'Не указан')+'"'
	+',"ThirdLevel":"'+isnull(TL.name,'Не указан')+'"'
	+',"MainManager":"'+isnull(MM.Name,'Не указан')+'"'
	+',"Manager":"'+isnull(Em.Name,'Не указан')+'"'
	+',"Region":"'+isnull(RG.name,'Не указан')+'"'
	+',"FullDebitore":'+CONVERT(nvarchar(20),Temp1.FullDebitore)+''
	
	+',"LimitDebitore":'+CONVERT(nvarchar(20),IIF(
		Temp1.FullDebitore >= Temp1.[LimitDebitore], 
		Temp1.[LimitDebitore], 
		Temp1.FullDebitore))+''
	
	+',"DebitoreOwed":'+CONVERT(nvarchar(20),(Temp1.FullDebitore - IIF(Temp1.FullDebitore >= Temp1.[LimitDebitore], 
		Temp1.[LimitDebitore], Temp1.FullDebitore)))+''

	+',"Debitore7Days":'+CONVERT(nvarchar(20),IIF(
		Temp1.FullDebitore
		- Temp1.LimitDebitore
		<= 0.0, 0.0,
		IIF(Temp1.FullDebitore
			- Temp1.LimitDebitore
			>= Temp1.[Debitore7Days],
		Temp1.[Debitore7Days],
		Temp1.FullDebitore
			- Temp1.LimitDebitore)))+''

	+',"Debitore14Days":'+CONVERT(nvarchar(20),IIF(
		Temp1.FullDebitore
		- Temp1.LimitDebitore
		- Temp1.Debitore7Days
		<= 0.0, 0.0,
		IIF(Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			>= Temp1.[Debitore14Days],
		Temp1.[Debitore14Days],
		Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days)))+''
	+',"Debitore21Days":'+CONVERT(nvarchar(20),IIF(
		Temp1.FullDebitore
		- Temp1.LimitDebitore
		- Temp1.Debitore7Days
		- Temp1.Debitore14Days
		<= 0.0, 0.0,
		IIF(Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			- Temp1.Debitore14Days
			>= Temp1.[Debitore21Days],
		Temp1.[Debitore21Days],
		Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			- Temp1.Debitore14Days)))+''
			
	+',"Debitore28Days":'+CONVERT(nvarchar(20),IIF(
		Temp1.FullDebitore
		- Temp1.LimitDebitore
		- Temp1.Debitore7Days
		- Temp1.Debitore14Days
		- Temp1.Debitore21Days
		<= 0.0, 0.0,
		IIF(Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			- Temp1.Debitore14Days
			- Temp1.Debitore21Days
			>= Temp1.[Debitore28Days],
		Temp1.[Debitore28Days],
		Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			- Temp1.Debitore14Days
			- Temp1.Debitore21Days)))+''
			
	+',"DebitoreMoreThen28Days":'+CONVERT(nvarchar(20),IIF(
		Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			- Temp1.Debitore14Days
			- Temp1.Debitore21Days
			- Temp1.Debitore28Days
		<= 0.0, 
		0.0,
		Temp1.FullDebitore
			- Temp1.LimitDebitore
			- Temp1.Debitore7Days
			- Temp1.Debitore14Days
			- Temp1.Debitore21Days
			- Temp1.Debitore28Days
		))+'},'

from(

	select 
		AllDocs.IDКонтрагент as [contragentId],
		AllDocs.[agreement_id] AS [agreement_id],
		SUM(AllDocs.[Money]) as [FullDebitore],
		SUM(IIF([LimitDays] >= 0 and AllDocs.[Money] > 0.0, AllDocs.[Money], 0.0)) as [LimitDebitore],
		SUM(IIF([LimitDays] >= -7 and [LimitDays] < 0 and AllDocs.[Money] > 0.0, AllDocs.[Money], 0.0)) as [Debitore7Days],
		SUM(IIF([LimitDays] >= -14 and [LimitDays] < -7 and AllDocs.[Money] > 0.0, AllDocs.[Money], 0.0)) as [Debitore14Days],
		SUM(IIF([LimitDays] >= -21 and [LimitDays] < -14 and AllDocs.[Money] > 0.0, AllDocs.[Money], 0.0)) as [Debitore21Days],
		SUM(IIF([LimitDays] >= -28 and [LimitDays] < -21 and AllDocs.[Money] > 0.0, AllDocs.[Money], 0.0)) as [Debitore28Days]
	from(
		select 
			contragent_id as [IDКонтрагент],
			agr.id AS [agreement_id],
			DATEDIFF ( DAY , DATEADD(day, -ISNULL(agr.overdueDay, 0) - 1, @date) , MIN(IIF([Money] > 0, f.[Period], NULL))) as [LimitDays],
			Sum([Money])  AS [Money]
		from dbo.ent_DocumentsOfSettlementsByDocuments f
		left join dbo.ent_Agreement agr on agr.id = f.agreement_Id
		where f.Period < @date
		group by f.[contragent_id], agr.id, agr.[overdueDay], f.[DocumentBinID]

		union all

		select 
			contragent_id as [IDКонтрагент],
			agr.id AS [agreement_id],
			DATEDIFF ( DAY , DATEADD(day, -ISNULL(agr.overdueDay, 0) - 1, @date) , f.Period) as [LimitDays],
			[Money]  AS [Money]
		from dbo.ent_DocumentsOfSettlementsByContragents f
		join dbo.ent_Agreement agr on agr.id = f.agreement_Id
		where f.Period < @date
	) AllDocs
	group by  AllDocs.agreement_id,AllDocs.IDКонтрагент
)Temp1
join ent_Contacts c WITH (NOLOCK) ON Temp1.[contragentId] = c.id_contact  AND  Temp1.FullDebitore > 0 and c.isReport = 1
LEFT JOIN dbo.ent_Agreement agr WITH (NOLOCK) 
ON Temp1.agreement_id = agr.id
LEFT JOIN dbo.ent_FirstLevels AS FL
ON C.firstLevel_id=FL.id
LEFT JOIN dbo.ent_FirstLevels AS SL
ON C.secondLevel_id=SL.id
LEFT JOIN dbo.ent_FirstLevels AS TL
ON C.thirdLevel_id=TL.id
LEFT JOIN dbo.ent_MainManagers AS MM
ON C.mainManager_id=MM.id
LEFT JOIN dbo.ent_Employe AS EM
ON C.employe_id=EM.id
LEFT JOIN dbo.ent_Regions AS RG
ON C.region_id=RG.id
FOR xml path(''));

SELECT cast(
'['+
isnull( STUFF(  
 @resultQuery,
LEN(@resultQuery)
, 1
, ''),'')+']' AS text) as jsontext