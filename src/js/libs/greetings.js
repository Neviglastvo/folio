export default function greetings() {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        const args = ['%c Oh, hello. Dunno what you expect to see here, but welcome. This page not aimed to show best practices and perfect code style, it exists for only reason - it show my completed works. Thats all. If you expect to see how i`m coding - check my works. %c  ¯\\\_(ツ)_/¯ ', 'margin: 10px 0;border: 1px solid #fff;color: #fff; background: #313233; padding:5px;', 'color: #fff; background: #313233; padding:5px 0;border: 1px solid #fff;'];
        window.console.log.apply(console, args);
    } else if (window.console) {
        window.console.log('Oh, hello. Dunno what you expect to see here, but welcome. This page not aimed to show best practices and perfect code style, it exists for only reason - it show my completed works. Thats all. If you expect to see how i`m coding - check my works.  \n ¯\\\_(ツ)_/¯ ');
    }
}
