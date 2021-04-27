#!/bin/bash -xe
file=statemachine.json
ROLE=`aws iam list-roles | grep role/lab5-states | cut -f2- -d: | xargs`
ARN=`aws stepfunctions list-state-machines | grep stateMachine:Fancy-StateMachine | cut -f2- -d: | tr -d ',' | xargs`
FUNC1=`aws lambda list-functions | grep function:validate_data | cut -f2- -d: | tr -d ',' | xargs`
FUNC2=`aws lambda list-functions | grep function:add_data | cut -f2- -d: | tr -d ',' | xargs`
sed -i "s/FMI1/$FUNC1/g" "$file"
sed -i "s/FMI2/$FUNC2/g" "$file"
aws stepfunctions update-state-machine --state-machine-arn $ARN --role-arn $ROLE \
--definition "$(cat statemachine.json)"
