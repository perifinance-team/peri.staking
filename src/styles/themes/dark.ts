const navy = '#181339'
//main backgorund
const lightblue = 'rgb(82, 113, 255, 0.1)'
//panel
const blueGreen = '#184771'
//button
const white = '#FFFFFF'
//subtext
const skyblue = 'rgb(0, 238, 255, 1)';
//title, button

const skyblueBorder = 'rgb(0, 238, 255, 0.2)';

export const dark = {
    backgroundColor: {
        body: navy,

        // #23265f
        panel: lightblue
    },
    button: blueGreen,
    border: skyblueBorder,
    hover: {
        button: skyblue,
        background: lightblue
    },
    font: {
        primary: skyblue,
        secondary: white,
    },
    barChart: {
        left: skyblueBorder,
        right: lightblue
    },
    table: {
        theader: lightblue
    }
    
}