DECLARE  @date date = '<calculateDate>';
declare @agreementId int = <agreementId>;


declare @fullDebitore money;
declare @period as datetime2;
declare @docName as nvarchar(200);
declare @agreementName as nvarchar(200);
declare @limitDays as int;
declare @money as money;
declare @sumMoney as money = 0.0;
declare @diff as money;

select 
	@fullDebitore = SUM(AllDocs.[Money])
	from(
		select 
			T.[agreement_id] as [IDAgreement],
			T.[Money]  AS [Money]
		from [dbo].[ent_DocumentsOfSettlementsByDocuments] T
		where T.[agreement_id] = @agreementId and T.[Period] < @date
		
		union all

		select 
			[agreement_id] as [IDAgreement],
			[Money]  AS [Money]
		from [dbo].[ent_DocumentsOfSettlementsByContragents]
		where [agreement_id] = @agreementId and [Period] < @date
	) AllDocs
	group by 
		AllDocs.IDAgreement



DECLARE MY_CURSOR CURSOR FOR


select 
		T1.[AgreementName] AS [AgreementName],
		T1.[Period] as [Period],
		T1.[DocName]
			+ ' ' 
			+ RTRIM(T1.[DocNumber]) 
			+ ' ' 
			+ FORMAT(T1.[Period],'dd.MM.yyyy HH:mm:ss')
		as [DocName],
		T1.LimitDays as [LimitDays],
		T1.[Money] as [Money]
	from(
		select 
			a.name AS [AgreementName],
			T.[Period],
			T.[DocNumber],
			ISNULL(dr.docName, 'Document' + cast(T.[DocumentNameId] as nvarchar(4))) as [DocName],
			DATEDIFF ( DAY ,DATEADD(day, -a.[overdueDay]-1, @date) , T.Period) as [LimitDays],
			T.[Money]
		from [dbo].[ent_DocumentsOfSettlementsByDocuments] T
		join [dbo].[ent_Agreement] a on a.[id] = T.[agreement_id]
		LEFT OUTER JOIN dbo.dsh_Document1CReference dr on dr.id = T.[DocumentNameId]
		where T.[agreement_id] = @agreementId and T.[Period]  < @date and T.[Money] > 0

		union all

		select 
			a.name AS [AgreementName],
			T.[Period],
			T.[DocNumber],
			ISNULL(dr.docName, 'Document' + cast(T.[DocumentNameId] as nvarchar(4))) as [DocName],
			DATEDIFF ( DAY ,DATEADD(day, -a.[overdueDay]-1, @date) , T.Period) as [LimitDays],
			T.[Money]
		from [dbo].[ent_DocumentsOfSettlementsByContragents] T
		join [dbo].[ent_Agreement] a on a.[id] = T.[agreement_id]
		LEFT OUTER JOIN dbo.dsh_Document1CReference dr on dr.id = T.[DocumentNameId]
		where T.[agreement_id] = @agreementId and T.[Period]  < @date and T.[Money] > 0
	) T1
	where T1.[Money] > 0.0
	order by T1.[Period] desc

DECLARE @temp TABLE (
	AgreementName nvarchar(200),
	Period datetime2,
	DocName nvarchar(200),
	FullDebitore money,
	LimitDays int,
	LimitDebitore money,
	DebitoreOwed money,
	Debitore7Days money,
	Debitore14Days money,
	Debitore21Days money,
	Debitore28Days money,
	DebitoreMoreThen28Days money);


OPEN MY_CURSOR;

FETCH NEXT FROM MY_CURSOR INTO @agreementName, @period, @docName, @limitDays, @money;



WHILE @@FETCH_STATUS = 0
BEGIN
	set @diff = @fullDebitore - @sumMoney

	if(@diff < ISNULL(@money, 0.0))
	begin
		set @money = @diff;
	end

	set @sumMoney = @sumMoney + ISNULL(@money, 0.0);

	insert into @temp
		(AgreementName, Period, DocName, LimitDays,FullDebitore, DebitoreOwed, LimitDebitore, Debitore7Days, Debitore14Days, Debitore21Days, Debitore28Days, DebitoreMoreThen28Days)
	values
		(@agreementName,
		@period,
		@docName,
		@limitDays,
		IIF(@limitDays < 0 , @money, 0.0),
		0,
		IIF(@limitDays >= 0 , @money, 0.0),
		IIF(@limitDays >= -7 and @limitDays < 0 , @money, 0.0),
		IIF(@limitDays >= -14 and @limitDays < -7 , @money, 0.0),
		IIF(@limitDays >= -21 and @limitDays < -14 , @money, 0.0),
		IIF(@limitDays >= -28 and @limitDays < -21 , @money, 0.0),
		IIF(@limitDays < -28 , @money, 0.0));
		
	if(@sumMoney >= @fullDebitore) 
		break; 

	FETCH NEXT FROM MY_CURSOR INTO @agreementName, @period, @docName, @limitDays, @money;
END

CLOSE MY_CURSOR;

DEALLOCATE MY_CURSOR;

DECLARE @resultQuery nvarchar(max)

SET @resultQuery=(
select 
'{"Contact_Document":"'+DocName++'"'
+',"FullDebitore":'+CONVERT(nvarchar(20),FullDebitore)	  +''
	+',"LimitDebitore":'+CONVERT(nvarchar(20),LimitDebitore)  +''

	+',"DebitoreOwed":'+CONVERT(nvarchar(20),DebitoreOwed) +''

	+',"Debitore7Days":'+CONVERT(nvarchar(20),Debitore7Days) +''

	+',"Debitore14Days":'+CONVERT(nvarchar(20),Debitore14Days) +''

	+',"Debitore21Days":'+CONVERT(nvarchar(20),Debitore21Days) +''
	+',"Debitore28Days":'+CONVERT(nvarchar(20),Debitore28Days) +''

	+',"DebitoreMoreThen28Days":'+CONVERT(nvarchar(20),DebitoreMoreThen28Days) +'},'
from @temp
<ExpiredConditionalDays>
FOR xml path(''));

SELECT cast(
'['+
isnull( STUFF(  
 @resultQuery,
LEN(@resultQuery)
, 1
, ''),'')+']' AS text) as jsontext;