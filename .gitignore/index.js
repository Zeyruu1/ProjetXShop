const Discord = require('discord.js')
const client = new Discord.Client()
const ms = require('ms')
const fs = require('fs')

let prefix = '/'

client.on('ready', function () {
    console.log('Bot ON')
    client.user.setActivity("Modère sur Projet X Shop")

})

client.login(require('./token.json'))

client.on('error', (error) => {
    console.log(error)
})

//help
client.on('message', message => {

    if (!message.guild) return;
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLocaleLowerCase() === prefix +'help'){
        if(args[1]) return message.channel.send("Syntaxe incorrecte, essayez plutôt `/help` :x:")
        let embed = new Discord.RichEmbed()
            .setColor('#800000')
            .setThumbnail('https://contenthub-static.grammarly.com/blog/wp-content/uploads/2018/05/how-to-ask-for-help-760x400.jpg')
            .setTitle("🔨 Page d'aide 🔨")
            .addField('/mute <pseudo> <raison>','Mute un joueur indéfiniment.',true)
            .addField('/tempmute <pseudo> <temps> <raison>','Tempmute un utilisateur pendant une durée déterminée.',true)
            .addField('/unmute <pseudo>','Unmute un utilisateur mute ou tempmute.',true)
            .addField('/ban <pseudo> <raison>', 'Banni un utilisateur indéfiniment.',true)
            .addField('/tempban <pseudo> <temps> <raison>','Tempban un utilisateur pendant une durée déterminée.',true)
            .addField('/clear <nombre>','Clear un certain nombre de message. Il ne faut pas dépasser 100.',true)
            .addField('/kick <pseudo> <raison>','Kick un utilisateur.',true)
            .addField('/say','Faire de votre bot un esclave qui envoie vos messages !')
            .setFooter(`Projet X Bot `)
        message.channel.send({embed})
    }

    if(args[0].toLocaleLowerCase() === prefix +'ppchange'){
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande :x:')
        if (!message.guild) return;
        const url = args.slice(1,2).join(" ");
        const verifyurl = url.slice(0,7);
        if(!(url.includes(".png") || url.includes('.jpg'))) return message.channel.send("Veuillez indiquer l'URL **d'une image** :face_palm: :x:")
        if (verifyurl !== "http://" && verifyurl !== "https:/") return message.channel.send("Veuillez indiquer **un URL valide** :x:")
        client.user.setAvatar(url)
        message.channel.send("Avatar du bot **changé** :white_check_mark:")
    }

})

client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
    let reason = args.slice(3).join(" ");
    let banreason = args.slice(2).join(" ");

    if(args[0].toLowerCase()===prefix + 'tempban') { 
            if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande :x:')
            let member = message.mentions.members.first()
            let params = message.content.split(" ").slice(1);
            let time = params [1];
            if (!member) return message.channel.send('Veuillez mentionner un utilisateur :x:')
            if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id)  return message.channel.send('Vous ne pouvez pas bannir cet utilisateur :x:')
            if(!time) return message.reply("Veuiller spécifier un temps de ban :x:");
            if (!member.bannable) return message.channel.send('Je ne peux pas bannir cet utilisateur :x:')
            if(!reason) return message.channel.send("Veuillez donner une raison :x:")
            message.channel.bulkDelete(1)
            message.guild.ban(member, ms(ms(time), {long: true}))
            message.channel.send('*' + member.user.username + '* a été banni '+ms(ms(time), {long: true})+' pour : **'+reason+'** :white_check_mark:')

            setTimeout(function(){
                message.guild.unban(member.user);
                message.channel.send(`${member.user} a été **unban** :white_check_mark:`)
                
            },ms(time));
    }

    if(args[0].toLowerCase()===prefix + 'ban') { 
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande :x:')
        let member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner un utilisateur :x:')
        if(!banreason) return message.channel.send("Veuillez donner une raison :x:")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id)  return message.channel.send('Vous ne pouvez pas bannir cet utilisateur :x:')
        if (!member.bannable) return message.channel.send('Je ne peux pas bannir cet utilisateur :x:')
        message.channel.bulkDelete(1)
        message.guild.ban(member)
        message.channel.send('*' + member.user.username + '* a été banni pour '+banreason+' :white_check_mark:')
}
});

client.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
    let reason = args.slice(2).join(" ");

    if(args[0].toLowerCase()===prefix + 'kick') {
            if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande :x:')
            let member = message.mentions.members.first()
            if (!member) return message.channel.send('Veuillez mentionner un utilisateur :x:')
            if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id)  return message.channel.send('Vous ne pouvez pas exclure cet utilisateur :x:')
            if (!member.kickable) return message.channel.send('Je ne peux pas exclure cet utilisateur :x:')
            if(!reason) return message.channel.send("Veuillez donner une raison :x:")
            message.channel.bulkDelete(1)
            member.kick()
            message.channel.send('*' + member.user.username + '* a été exclu pour : **'+reason+'** :white_check_mark:')
    }
});

client.on('message', message => {
    if (!message.guild) return
    let args1 = message.content.trim().split(/ +/g)
    let args = message.content.split(" ").slice(1);
    let verifynumber = isNaN(args[0])

    if(args1[0].toLowerCase()===prefix + 'clear'){
        if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande :x:')
        if(!args[0]) return message.channel.send('Syntaxe : `!clear <nombre>` :x:')
        if(verifynumber === true ) return message.channel.send('Veuillez indiquer **un nombre** :x:')
        if(args[0] > 100) return message.channel.send('Veuillez indiquer un nombre **inférieur ou égal à 100** :x:')
        message.channel.bulkDelete(args[0]).then(() =>{
            message.channel.send(`**${args[0]} messages** supprimés :white_check_mark: `)
            message.channel.bulkDelete(1)
        })
        
    }
})

client.on("message",message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
    

    if(args[0].toLowerCase()===prefix + 'tempmute') {
        let reason = args.slice(3).join(" ");
        let member = message.mentions.members.first();
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`Vous n'avez **pas la permission** d'utiliser cette commande :x:`);
        if(!member) return message.reply("Veuillez mentionner un utilisateur :x:");
        let muteRole = message.guild.roles.find("name", "muted");
        if(!muteRole) return message.reply("Le grade muted n'est pas trouvé :x:")
        if(!reason) return message.channel.send("Veuillez indiquer **une raison** :x:")
        let params = message.content.split(" ").slice(1);
        let time = params [1];
        if(!time) return message.reply("Veuiller spécifier un temps de mute :x:");
        if(member.roles.has(muteRole.id)) return message.channel.send(`${member.user} est **déjà mute** :x:`);
        let verifytime = isNaN(args[2])
        if(verifytime === false) return message.channel.send('Veuillez utiliser un temps en **secondes (s), minutes (m), days (d)** :x:')
        if(!(time.includes('0') || time.includes('1') || time.includes('2') || time.includes('3') || time.includes('4') || time.includes('5') || time.includes('6') || time.includes('7') || time.includes('8') || time.includes('9'))) return message.channel.send('(erreur ou jai du mal) Veuillez utiliser un temps en **secondes (s), minutes (m), days (d)** :x:')
        if(!(time.includes('s') || time.includes('d') || time.includes('h') || time.includes('m'))) return message.channel.send('Veuillez utiliser un temps en **secondes (s), minutes (m), days (d)** :x:')
        message.channel.bulkDelete(1)
        member.addRole(muteRole.id);
        message.channel.send(`${member.user} a été **mute** pendant **${ms(ms(time), {long: true})}** pour** ${reason}** par **${message.author}** :white_check_mark:`)

        setTimeout(function(){
            member.removeRole(muteRole.id);
            message.channel.send(`${member.user} a été **unmute** :white_check_mark:`)
            
        },ms(time));
    }

    if(args[0].toLowerCase()===prefix + 'unmute') {
        let member = message.mentions.members.first();
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`Vous n'avez **pas la permission** d'utiliser cette commande :x:`);
        if(!member) return message.reply("Veuillez mentionner un utilisateur :x:");
        let muteRole = message.guild.roles.find("name", "muted");
        if(!muteRole) return message.reply("Le grade muted n'est pas trouvé, impossible de l'enlever à l'utilisateur :x:")
        
        if(!member.roles.has(muteRole.id)) return message.channel.send(`${member.user} n'est **pas mute** :x:`);
        message.channel.bulkDelete(1)
        member.removeRole(muteRole.id);
        message.channel.send(`${member.user} a été **unmute** par **${message.author}** :white_check_mark:`)
    }

    if(args[0].toLowerCase()===prefix + 'mute') {
        let reason = args.slice(2).join(" ");
        let member = message.mentions.members.first();
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`Vous n'avez **pas la permission** d'utiliser cette commande :x:`);
        if(!member) return message.reply("Veuillez mentionner un utilisateur :x:");
        let muteRole = message.guild.roles.find("name", "muted");
        if(!muteRole) return message.reply("Le grade muted n'est pas trouvé, impossible de l'enlever à l'utilisateur :x:")
        
        if(!reason) return message.channel.send("Veuillez indiquer **une raison** :x:")
        if(member.roles.has(muteRole.id)) return message.channel.send(`${member.user} est **déjà mute** :x:`);
        message.channel.bulkDelete(1)
        member.addRole(muteRole.id);
        message.channel.send(`${member.user} **a été mute** par ${message.author} pour **${reason}** :white_check_mark:`)
    }

    if(args[0].toLowerCase() === prefix + "say") {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande :x:')
        if(!args[1] && message.attachments.size === 0) {
            return message.reply("Envoyez une image ou un message!");
        }

        if(message.attachments.size !== 0) {
            message.attachments.forEach(function (attachement) {
            message.channel.sendFile(attachement.url);
            })   
        }
        
        let messageText = args.join(" ").slice(5);
        message.channel.send(messageText);
        return message.delete();
    }
});

