const navy = '#181339'
//main backgorund
const lightBlue = 'rgb(82, 113, 255, 0.1)'
//panel
const blueGreen = '#184771'
//button
const white = '#FFFFFF'
//subtext
const skyblue = 'rgb(0, 238, 255, 1)';
//title, button

const skyblueBorder = 'rgb(0, 238, 255, 0.2)';

const red = 'rgb(217, 68, 84)';

export const dark = {
    background: {
        body: navy,

        // #23265f
        panel: lightBlue,
        button: skyblueBorder
    },
    button: {
        primary: lightBlue,
        secondary: blueGreen
    },
    border: skyblueBorder,
    hover: {
        button: skyblue,
        background: lightBlue
    },
    font: {
        primary: skyblue,
        secondary: white,
        red
    },
    barChart: {
        left: skyblueBorder,
        right: lightBlue
    },
    table: {
        theader: lightBlue
    }
    
}