echo 1

%LIQUIBASE_HOME%\liquibase --classpath=%LIQUIBASE_HOME%\sqljdbc_4.0\rus\sqljdbc4.jar --driver=com.microsoft.sqlserver.jdbc.SQLServerDriver --url="jdbc:sqlserver://%DashboardServer%;databaseName=Dashboard" --username=%DashboardDbUser% --password=p@s$w0rD --changeLogFile=DashBoardChangeLog.xml migrate