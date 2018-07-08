delete from [Dashboard].[dbo].[RoleIndicator]


insert into [Dashboard].[dbo].[RoleIndicator]

SELECT 
	r.id as roleGuid,
	i.id as indicator_id

FROM
	[Dashboard].[dbo].[rpt_ByPeriods_Indicators] as i,
	[DashboardUsers].[dbo].[AspNetRoles] as r

	where 
		not measureName is null 
		and not (r.Name = 'manager' and measureName in ('Profitability', 'Cost', 'grossProfit', 'grossProfitCommercialProduct'))
		and not (r.Name = 'SmallAdmin' and measureName in ('grossProfit', 'grossProfitCommercialProduct'))