const VkBot = require('node-vk-bot-api');
const Session = require('node-vk-bot-api/lib/session');
const Scene = require('node-vk-bot-api/lib/scene');
const Stage = require('node-vk-bot-api/lib/stage');
const Markup = require('node-vk-bot-api/lib/markup');
//36ebc1ba4fda43d2c8419620aa6065b0a54ee012cc54e1858cea1a44b11a0b5cc8e1d6a1c2bb329b25b67
const access_token = '66fda665501dee70ac2ca92cd764b2f0a894b0aa039f2072c2164c38252464f5b5fc7d8f3bb7c5c954896';
const bot = new VkBot(access_token);
const session = new Session();
const start_res = /^начать|^start/i;

bot.use(session.middleware());

bot.use((ctx, next) => {
    if (start_res.test(ctx.message.body) || ctx.session.user) {
        next();
    }
    else {
        ctx.session.user = { first_name: 'Noname' };
        ctx.reply('Чтобы начать, нажмите кнопку;', null, Markup
            .keyboard([
                [
                    Markup.button('Начать', 'primary')
                ]
            ])
            .oneTime())
    }
})


const scene = new Scene('s',
    (ctx) => {
        ctx.scene.next();
        ctx.session.anketa = [];
        var msg = `Для регистрации необходимо ответить на несколько вопросов. Это позволит нам лучше понять сможите ли Вы принять участие в турнире на данном этапе.

1. Ваше имя`
        ctx.reply(msg);

    },
    (ctx) => {
        var msg = `Ваша фамилия`
        ctx.session.anketa.push(ctx.message.body);
        ctx.scene.next();
        ctx.reply(msg);
    },
    (ctx) => {
        var msg = `Ваш возраст [полных лет]`
        ctx.session.anketa.push(ctx.message.body);
        ctx.scene.next();
        ctx.reply(msg);
    },
    (ctx) => {
        var msg = `Из какого вы города?`
        ctx.session.anketa.push(ctx.message.body);
        ctx.scene.next();
        ctx.reply(msg);
    },
    (ctx) => {
        var msg = `Мобильный телефон`
        ctx.session.anketa.push(ctx.message.body);
        ctx.scene.next();
        ctx.reply(msg);
    },
    (ctx) => {
        ctx.scene.leave();
        ctx.session.anketa.push(ctx.message.body);
        var msg = `Новая заявка:

Имя: ${ctx.session.anketa[0]}
Фамилия: ${ctx.session.anketa[1]}
Возраст: ${ctx.session.anketa[2]}
Город: ${ctx.session.anketa[3]}
Мобильный телефон: ${ctx.session.anketa[4]}

От: https://vk.com/id${ctx.session.user.id}`;

        bot.sendMessage(161882512, msg);


        ctx.reply(` ${ctx.session.user.first_name}, Спасибо за регистрацию😊 Ссылка на приложение - https://vk.com/app6847090
          Ваши параметры входа:
          Логин:  ${ctx.session.anketa[4]}
          Пароль: ${ctx.session.user.id}`, null, Markup
            .keyboard([
                [
                    Markup.button('Начать', 'primary')
                ],
            ])
            .oneTime());
    });


const stage = new Stage(scene);

bot.use(stage.middleware());

bot.command(start_res, async (ctx) => {

    var user = await bot.api('users.get', { access_token: access_token, user_ids: ctx.message.user_id, v: 5.92 }),
        first_name = user.response[0].first_name;
        ctx.session.user = user.response[0];

    var hello_msg = `Здравствуйте, ${first_name}!
Приветсвие...
...
...
Вы еще не зарегестрированы в нашей программе ...

`;

    ctx.reply(hello_msg, null, Markup
        .keyboard([
            [
                Markup.button('Зарегестрироваться','primary'),
                Markup.button('FAQ')
            ],
            [
                Markup.button('Узнать больше о турнире')
            ]

        ])
        .oneTime())
})






bot.command('Зарегестрироваться', (ctx) => {
  first_name = ctx.session.user.first_name;
  var msg = `${first_name}, благодарю за интерес! Осталось пройти всего 3 шага до активации вашего статуса ЭКСПЕРТ Турнира Дальнобойщиков.
   1. Подпишитесь на новости группы [mustgame|Участников Турнира]
   2. Ознакомтесь с правилами участия в турнире https://vk.com/@mustgame-pravila-i-prizy-mezhdunarodnogo-turnira-dalnoboischikov`;
   ctx.reply(msg);
   msg = ` 3. Заполнить анкету участника 👇
            https://vk.com/app6850019_-142840734`;
  ctx.reply(msg, null, Markup
      .keyboard([
        [
            Markup.button('Узнать больше о турнире'),

        ],
        [
            Markup.button('FAQ')
        ],

      ])
      .oneTime())

})



bot.command('FAQ', (ctx) => {
  var msg = `Что вас интересует?`;

  ctx.reply(msg, null, Markup
      .keyboard([
        [
            Markup.button('Я не гражданин РФ')

        ],
        [
            Markup.button('Вопрос 2'),
            Markup.button('Вопрос 3')
        ],
        [
            Markup.button('Вопрос 4'),
            Markup.button('Вопрос 5')
        ],
        [
            Markup.button('Вернуться назад','negative')
        ]
      ])
      .oneTime())

})



bot.command('Узнать больше о турнире', (ctx) => {
  var msg = `1-Й МЕЖДУНАРОДНЫЙ ТУРНИР ДАЛЬНОБОЙЩИКОВ - 2019

Мы хотим изменить мир грузоперевозок!
Привнести в нашу суровую реальность, маленькую искру чувств и эмоций, интерес и полезный азарт с помощью простой Игры для водителей и владельцев грузовиков!

Приз за 1 место в отборочном этапе 250.000 рублей!

Играйте и Выигрывайте!
Соревнуйтесь и Побеждайте!

Вместе с MUST - Игра по правилам!

1 февраля в 0:00 — 28 февраля в 23:59`;

  ctx.reply(msg, null, Markup
    .keyboard([
        [
            Markup.button('Зарегестрироваться','primary'),
        ],
        [
              Markup.button('FAQ')
        ]

    ])
      .oneTime())

})



bot.command('Я не гражданин РФ', (ctx) => {
  first_name = ctx.session.user.first_name;
  var msg = `${first_name}, гражданство не имеет значения. В [mustgame|МЕЖДУНАРОДНОМ ТУРНИРЕ ДАЛЬНОБОЙЩИКОВ] могут принимать участие граждане любой страны. `;

  ctx.reply(msg, null, Markup
      .keyboard([
        [
            Markup.button('Я не гражданин РФ'),

        ],
        [
            Markup.button('Вопрос 2'),
            Markup.button('Вопрос 3')
        ],
        [
            Markup.button('Вопрос 4'),
            Markup.button('Вопрос 5')
        ],
        [
            Markup.button('Вернуться назад','negative')
        ]
      ])
      .oneTime())

})

bot.command('Вернуться назад', (ctx) => {
  first_name = ctx.session.user.first_name;
  var msg =`${first_name}, вы еще не зарегестрированы в нашей программе ...`;
  ctx.reply(msg, null, Markup
      .keyboard([
          [
              Markup.button('Зарегестрироваться','primary'),
              Markup.button('FAQ')
          ],
          [
              Markup.button('Узнать больше о турнире')
          ]

      ])
      .oneTime())
})


bot.command(/(.+)/, (ctx) => {
    var help_text = `Я вас не понимаю!`;

    ctx.reply(help_text, null, Markup
        .keyboard([[
            Markup.button('Начать', 'primary')
        ]])
        .oneTime()
    )
})



bot.startPolling()
