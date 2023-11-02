[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![Maintained by Yaakov Lerer](https://img.shields.io/badge/maintained%20by-Lerer-brightgreen)](http://www.github.com/lerer) [![GitHub issues](https://img.shields.io/github/issues/lerer/veracode-badge/bug?color=red)](https://github.com/Lerer/veracode-badge/issues?q=is%3Aopen+is%3Aissue+label%3Abug) 

# Veracode Badges  
For README and other git repository decoration

__Note__ - The solution require AWS account for deployment

## Example
<p align="center">
  <img src="https://github.com/lerer/veracode-badge/blob/main/resources/policy_pass.png?raw=true" height="50" alt="Veracode Policy Pass Badge"/>
</p>

<p align="center">
  <img src="https://github.com/lerer/veracode-badge/blob/main/resources/policy_did_not_pass.png?raw=true" height="50" alt="Veracode Policy Fail Badge"/>
</p>


## Instruction:
To utilize the content, you will need to implement the following:
1) Setup permissions in the Veracode portal 
2) Install NodeJS, NPM, and the [Serverless Framework]('https://www.serverless.com/framework/docs/getting-started/' 'Serverless Framework')
3) Clone the repository
4) Creation of AWS deployment role
5) Configure the Serverless Framework to your AWS Account (using the pre-defined deployment role)
6) Update Environment Variable and Deploy
7) Update your `.md` files

## Installation details:
### 1. Setup Veracode Account permissions
We want to make sure the badge API only expose information for specific Application profiles. 

1. Login to the Veracode platform as Admin (we need to create team and user)
2. Navigate to the Admin section and create a new team (to control visibility)
   - do not select any user for that group
3. Navigate to the users admin section and create a new API Account 
   - Assign a single role: `Result API`
   - Select the Team you create in the previous step
4. Add the new Team to the applications` profiles you want to enable badging for.
5. Check your email inbox for the new Account Activation email and follow the steps to activate
   - Login to the account
   - [Generate and save the new account API Credentials.](https://help.veracode.com/r/t_create_api_creds) (You'll need it in the step #4)


### 2. install NodeJS, NPM, and Serverless

1. Use the following links and follow the instruction to install the LTS version:
   - [NodeJS (with NPM)](https://nodejs.org/en/)
   - [Serverless](https://www.serverless.com/framework/docs/getting-started/ 'Serverless Framework')
2. If you don't have account in SERVERLESS, please create one (it is free)
3. From your command line login to your account using `serverless login` and follow the instructions

### 3. Clone, Update and Deploy
1. Clone this repository: `git clone https://github.com/lerer/veracode-badge`
2. Import dependencies by executing `npm install`
3. Copy `empty.env` to `.env` and update the attributes
   - VERACODE_API_KEY=`<From the credentials in #1.5>`
   - VERACODE_API_SECRET=`<From the credentials in #1.5>`
   - AWS_Region=`<Your AWS deployment region>`
   - AWS_Account_ID=`<Your AWS Account ID (Numeric)>`
   - Stage=`<dev|prod>`  
  
### 4. AWS Policy for the deployment of the solution
In order to provided the minimun policy required for the deployment of the solutions, we will need to generate a Policy. 

1. Run the command: __`npm run generate-permissions`__ which will generate a JSON format policy.
   - This will only work correctly if you filled-in the environment variable in the previous stage
   - The policy is generates in the project root directory inside a file: __`policy.json`__
2. Login to your AWS portal, navigate IAM Service and create a new policy
   1. Paste the `policy.json` file content into the JSON area of the policy. (Don't use the Visual editor).
   2. Save the policy

<details><summary><b>References</b></summary><p>
Serverless framework (used in the solution) need a role in AWS which will allow it to deploy its resources. An easy example can be found here:

- [Customizing your IAM Policy](https://seed.run/docs/customizing-your-iam-policy.html)

Example with explanaition how to deploy custom AWS IAM role:
- [Customize the Serverless IAM Policy](https://serverless-stack.com/chapters/customize-the-serverless-iam-policy.html)

Online Policy Generator
- [Serverless Permission Policy Generato](https://open-sl.github.io/serverless-permission-generator/)
> Note - the above generator may miss or generate over permissive policy

</p></details>
      
### 5. Configure Serverless to deploy to your AWS account

Serverless framework has few options to configure it. The method I tested was a manual deployment from my desktop. 


1) Create an AWS account for Serverless using the policy created in the previous stage: [Creating an IAM user in your AWS account
](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
   - Select `programmatic access` for user type 
2) Save the `Access Key ID` and `Secret Access Key`
3) __Connect your Serverless to AWS using the new user using the instructions in the [credentials configuration](https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/)__
   - From the terminal: `serverless config credentials --provider aws --key <Access Key ID> --secret <Secret Access Key>`
 
### 6. Update Environment Variable and Deploy
1) Navigate to `package.json` file and update the deploy scripts with your __own AWS deployment region__
    __Here:__
    ```JSON
    "scripts": {
      ...
      "deploy-dev": "serverless deploy --stage dev --region ap-southeast-2",
      "deploy": "serverless deploy --region ap-southeast-2",
      ...
    }
    ```
2) Run the deployment command: __`npm run deploy`__
3) Pay attenbtion to the deployment output for output and any error/s
   * look for the `Service Information` section and note the `endpoint` which should look similar to: 
     * `GET - https://n91dqmmhqy.execute-api.ap-southeast-2.amazonaws.com/prod/badge`

### 7. Update your `.md` files

Add the following text to the top of your `README.md` file
```
![Veracode SAST Policy compliance](https://n91dqmmhqy.execute-api.ap-southeast-2.amazonaws.com/prod/badge?appname=<Veracode Application Name>)
```

__Note__ - replace the `<Veracode Application Name>` with your Veracode Application ptrofile name 

## Solution Imlpementation:

The repository contains an implementation of SERVERLESS framework which can deploy a set of (18) resources in a chosen AWS region.

Among the resources:  

__Endpoints:__ 
  - GET - https://\<AWS API ID\>.execute-api.\<region\>.amazonaws.com/\<stage\>/badge
- 
__Functions:__
  - **badgeHandler:** {project}-{stage}-badgeHandler   
    
## Uninstall

To remove your solution entirely from AWS, simply run the following command from the terminal: `npm run remove`

     
       



