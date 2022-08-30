
const ZY = " ㄅㄆㄇㄈㄉㄊㄋㄌˇㄍㄎㄏˋㄐㄑㄒㄓㄔㄕㄖˊㄗㄘㄙ˙ㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ";
const EN = " 1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-";
const SP = "　";

let MAPZY = {}, MAPEN = {};
let CURRENT = null;
let MODE    = "FLAT";
let FULLMATCH = true;
let MAXZY   = 1;

const ZYC = {
    up:   "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ",
    mid:  "ㄧㄨㄩ",
    low:  "ㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ",
    tone: " ˊˇˋ˙",
};
let MAPZYC = {};

String.prototype.forEach = function() {
    return Array.from(this).forEach(...arguments);
};

window.onload = function() {
    init();
};

function init() {
    MAXZY = parseInt(OutputText.cols/3);
    ZY.forEach((c, i) => {
        MAPZY[c] = EN[i];
        MAPEN[EN[i]] = c;

        if (ZYC.up.includes(c)) {
            MAPZYC[c] = 0;
        } else if (ZYC.mid.includes(c)) {
            MAPZYC[c] = 1;
        } else if (ZYC.low.includes(c)) {
            MAPZYC[c] = 2;
        } else {
            MAPZYC[c] = 3;
        }
    });
};

function read() {
    return InputText.value;
};

function print(value) {
    OutputText.value = value;
};

function toABC() {
    CURRENT = "EN";
    FULLMATCH = true;
    let bpm = read();
    let ans = "";

    bpm.forEach(c => {
        if (MAPZY[c] == null) {
            ans += c;
            if (c != '\n') FULLMATCH = false;
        } else ans += MAPZY[c];
    });

    print(ans);
};

function toBPM() {
    CURRENT = "ZY";
    FULLMATCH = true;
    let abc = read();
    let ans = "";

    abc.forEach(c => {
        if (MAPEN[c] == null) {
            ans += c;
            if (c != '\n') FULLMATCH = false;
        } else ans += MAPEN[c];
    });

    if (MODE == "VERT" && FULLMATCH) {
        ans = toVert(ans);
    }

    print(ans);
};

function switchMode(event) {
    let isVertical = event.target.checked;
    MODE = isVertical? "VERT": "FLAT";

    if (CURRENT != "ZY" || !FULLMATCH) return;
    toBPM();
};

function toVert(flat) {
    let sentences = flat.split("\n");
    let vert = sentences.map(sentence => {
        let flag = 0b1111;
        let chars = ["", "", "", ""];
        let fillflag = function() {
            for (let i=0; i<4; i++) {
                if (flag&(2**i)) chars[i] += SP;
            }
            flag = 0b1111;
        };
        sentence.forEach(c => {
            let b = 2**MAPZYC[c];
            if (flag&b) {
                flag ^= b;
                chars[MAPZYC[c]] += c;
            } else {
                fillflag();
                flag ^= b;
                chars[MAPZYC[c]] += c;
            }
            if (b == 0b1000) fillflag();
        });
        if (flag) fillflag();

        let res = [], u = "", m = "", l = "";
        chars[0].forEach((c, i) => {
            u += c + ' ';
            m += chars[1][i] + chars[3][i];
            l += chars[2][i] + ' ';
            if (i%MAXZY == MAXZY-1) {
                res.push(u, m, l, '');
                u = "", m = "", l = "";
            }
        });
        if (u) {
            res.push(u, m, l, '');
        }
        return res.join("\n");
    }).join("\n\n");
    return vert;
};