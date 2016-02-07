@ECHO -------------------------------------------
@ECHO                JIRA HEADCRAB
@ECHO Install Node Packages and build output for
@ECHO publishing extension.
@ECHO -------------------------------------------
(if exist .\publish RD /s /q .\publish) && npm install && npm run grunt
