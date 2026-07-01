import { Amplify } from 'aws-amplify'


// 앱 진입점(main.tsx 등)에서 한 번만 import해서 실행되도록 해야 함
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "test",
      userPoolClientId: "test",
    },
  },
})
