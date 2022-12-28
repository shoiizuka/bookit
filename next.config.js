module.exports = {
  env:{
    DB_LOCAL_URI: 'mongodb://localhost:27017/bookit',//モンゴdbのローカルと接続
    DB_URI:'mongodb+srv://bookit:bookit@cluster0.yvazsab.mongodb.net/bookit?retryWrites=true&w=majority',//モンゴリアル接続

    //stripeApi
    STRIPE_API_KEY:'pk_test_51Jz1MRJwZi44U7BLyIR2BHfqsX1ShGzlZL1yJWNbNY46W8Nmc561aEXI6YCE40BCVMX0QXhK9mM3Pld62rY28d5L00lnc6qH4Q',
    STRIPE_SECRET_KEY:'sk_test_51Jz1MRJwZi44U7BLbrGEuDfgNWPAmILKWWzNlYQ7zVkicHYGBIlBqHHyTQyaid7e18GHuHAbzAbMRwmpDAgGi0Ar00I34NTQ25',
    //ターミナル操作
    STRIPE_WEBHOOK_SECRET:'whsec_gHKSczrt46g7fCTAbhXP9lqRmy9HDeAd',
    // 'whsec_72f4debb69ec2440b17b790a221c24312ca98ea57853e5366415ad5d0988d460',


    //クラウド写真api接続
    CLOUDINARY_CLOUD_NAME:'df4fkanqq',
    CLOUDINARY_API_KEY:'263891848514544',
    CLOUDINARY_API_SECRET:'DSSjxgg5VoHMzpF3Q_bRPzf-XGc',

    //パスワード再発行メールmailtrapAPI情報
    SMTP_HOST: 'smtp.mailtrap.io',
    SMTP_PORT: '2525',
    SMTP_USER: '157b668f861bcc',
    SMTP_PASSWORD: '1049b26e514dc8',
    SMTP_FROM_NAME: 'BOOKIT',
    SMTP_FROM_EMAIL: 'noreply@bookit.com',//一時的？
    
    //デプロイ用
    NEXTAUTH_URL: 'https://bookit-shoiizuka.vercel.app'



  },
  //イメージのURL上ドメインを許可する必要がる
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true
  },
}