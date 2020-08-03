const discord = require('discord.js');
const client = new discord.Client();
const fs = require("fs");
const request = require("request");
const VirusTotalApi = require('virustotal-api')
// Coloque a sua API do virustotal logo aí, essa abaixo é um exemplo. (não vai funcionar) (this is a example, not work)
const virusTotal = new VirusTotalApi('as9d9ua9dsa9u8d9a8s98dsa89udu8a9sd9ua9uda9u9ud9au8du98')

client.on('ready', () =>{ 
	console.log("O bot foi iniciado.");
});

client.on("message", (message) => {

	if (message.author.bot || message.channel.type === "dm") return;
	if (message.attachments.first() && message.attachments.first().size > 0) {

	const urlarchive = message.attachments.array()[0].url; 
	const tempName = urlarchive.split("/");
	const attachName = tempName[tempName.length-1]
	const l = attachName;

	function download(url){ require("request").get(url).pipe(fs.createWriteStream(attachName));}
		
	if (l.lenght <= 0) return;	
	if (l.includes(".jpeg") || l.includes(".png") || l.includes(".jpg") || l.includes(".gif") || l.includes(".txt") || l.includes(".mp4") || l.includes(".mp3") || l.includes(".mkv") || l.includes(".JPEG") || l.includes(".PNG") || l.includes(".JPG") || l.includes(".GIF") || l.includes(".TXT") || l.includes(".MP4") || l.includes(".MP3") || l.includes(".MKV")) {return;}
				
    	download(urlarchive);			
	message.delete().catch(O_o => O_o);
	
	// Enviando mensagem, que avisa que o bot está verificando o arquivo.
	message.channel.send("⚠️ Verificando o arquivo "+ "``"+attachName+"``" +", caso o mesmo for seguro o download será liberado na finalização da análise.").then(mensageminicial => {
    
	let replies = ["30000", "45000", "60000", "120000", "180000", "240000"]
	let result = Math.floor((Math.random() * replies.length));

	setTimeout(() => {

		function intervalo() {
		fs.readFile(attachName, (err, data) => { 
  		if (err) {console.log(`Cannot read file. ${err}`)} else {
		virusTotal.fileScan(data, 'file.js').then((response) => {
		virusTotal.fileReport(response.resource).then((result) => {
            	if (result.verbose_msg == 'Your resource is queued for analysis') return;
			if (result.verbose_msg === 'Scan finished, information embedded') {
			clearInterval(this);
			if (result.positives > 1 || result.positives === 1) {
					message.delete().catch(O_o => O_o);
					fs.unlinkSync(attachName);
                  	message.channel.send("**(VIRUS)** Arquivo verificado. Download não LIBERADO. (Quem enviou: <@"+message.author.id + "> ["+message.author.id+"])");
                  	mensageminicial.delete().catch(O_o => O_o);
                  	return;
			  } else {
                	message.channel.send("**(SEGURO)** Arquivo verificado. Download do arquivo: (Quem enviou: <@"+message.author.id + "> ["+message.author.id+"])", {files: [urlarchive]});
				    fs.unlinkSync(attachName);
                	mensageminicial.delete().catch(O_o => O_o);
			  }
			  return;
			}
			}).catch(err => {clearInterval(this); setInterval(intervalo, replies[result]);});
		}).catch(err => {clearInterval(this); setInterval(intervalo, replies[result]);});
    	}})}
	setInterval(intervalo, 15000);

	// Tempo para "iniciar o processo", extremamente recomendavel deixar 5000
	}, 5000); 
})}});

// Coloque o "token" de seu bot logo abaixo.
client.login('Coloque o token aqui.');
