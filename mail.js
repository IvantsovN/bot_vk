const express = require("express");
const bodyParser = require('body-parser');
const VkBot = require('node-vk-bot-api');
const access_token = '36ebc1ba4fda43d2c8419620aa6065b0a54ee012cc54e1858cea1a44b11a0b5cc8e1d6a1c2bb329b25b67';
const bot = new VkBot(access_token);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/h", function (request, response) {
    var msg = `Заявка с сайта:
Имя: ${request.body.name}
Email: ${request.body.email}
Город: ${request.body.city}

Описание проекта: ${request.body.message}`;

    bot.sendMessage(161882512, msg);
    bot.sendMessage(380013488, msg);
    response.redirect('success.html');
});

app.listen(8080);