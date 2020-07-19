const discord = require('discord.js');
const client = new discord.Client();
const fs = require("fs");
const request = require("request");
const VirusTotalApi = require('virustotal-api')
const virusTotal = new VirusTotalApi('e1c6cf3d3ae12d46318bb15802d3a596c7ff4e43da9faea362db20daa66307bf')

client.on('ready', () =>{console.log("O bot foi iniciado.")});

client.on("message", (message) => {

	if (message.author.bot) return; if (message.channel.type === "dm") return;
	if (message.attachments.first()) {
	if (message.attachments.first().size > 0) {
		console.log("Analisando quantia de bytes no arquivo..")
		console.log(message.attachments.first().size + " bytes detectados..")

		const linkfoda = message.attachments.array()[0].url; 
		const tempName = linkfoda.split("/");
		const attachName = tempName[tempName.length-1]
		const l = attachName;
		const member = message.member; 

		function download(url){ request.get(url).pipe(fs.createWriteStream(attachName));}
		
		if (l.lenght <= 0) return;	
		if (l.includes(".jpeg") || l.includes(".png") || l.includes(".jpg") || l.includes(".gif") || l.includes(".txt") || l.includes(".mp4") || l.includes(".mp3") || l.includes(".mkv")) {return;}
		if (l.includes(".JPEG") || l.includes(".PNG") || l.includes(".JPG") || l.includes(".GIF") || l.includes(".TXT") || l.includes(".MP4") || l.includes(".MP3") || l.includes(".MKV")) {return;}
				
    download(linkfoda);			
    message.delete();
		message.channel.send("⚠️ Verificando o arquivo "+ "``"+attachName+"``" +", caso o mesmo for seguro o download será liberado na finalização da análise.").then(mensageminicial => {
    console.log("Verificando o arquivo "+attachName+" aguarde para a conclusão da analise.");

		let replies = ["30000", "45000", "60000", "120000", "180000", "240000"]
		let result = Math.floor((Math.random() * replies.length));

		setTimeout(() => {

			function intervalo() {
			fs.readFile(attachName, (err, data) => { 
  			if (err) {console.log(`Cannot read file. ${err}`)} else {
			virusTotal.fileScan(data, 'file.js').then((response) => {
      let resource = response.resource

			virusTotal.fileReport(resource).then((result) => {
            if (result.verbose_msg == 'Your resource is queued for analysis') return;
			if (result.verbose_msg === 'Scan finished, information embedded') {
			  clearInterval(this);
			  if (result.positives > 1 || result.positives === 1) {
				  message.delete();
				  fs.unlinkSync(attachName); //apagar arquivo do HD
                  message.channel.send("**(VIRUS)** Arquivo verificado. Download não LIBERADO. (Quem enviou: <@"+message.author.id + "> ["+message.author.id+"])");
                  console.log("Arquivo '"+attachName+"' foi verificado (virus) e excluido do HD.");
                  mensageminicial.delete();
                  return;
			  } else {
                message.channel.send("**(SEGURO)** Arquivo verificado. Download do arquivo:", {files: [linkfoda]});
				fs.unlinkSync(attachName); //apagar arquivo do HD
				console.log("Arquivo '"+attachName+"' foi verificado (seguro) e excluido do HD.");
                mensageminicial.delete();
			  }
			  return;
			}
			}).catch(err => {clearInterval(this); setInterval(intervalo, replies[result]);});

		}).catch(err => {clearInterval(this); setInterval(intervalo, replies[result]);});

    	}})
	}
	setInterval(intervalo, 15000);

}, 5000); 
})}}});

client.login('NzM0MzExOTExNDA3MDkxNzYy.XxP3iQ.MZp7638LMmUqLd50g5vQxRCyggI');
