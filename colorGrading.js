import {
    BlendFunction,
    BrightnessContrastEffect,
    ColorAverageEffect,
    LUT3DEffect,
    EdgeDetectionMode,
    EffectPass,
    HueSaturationEffect,
    LookupTexture3D,
    LUT3dlLoader,
    LUTCubeLoader,
    RawImageData,
    SepiaEffect,
    SMAAEffect,
    SMAAImageLoader,
    SMAAPreset
} from "postprocessing";

import {
    ClampToEdgeWrapping,
    Color,
    LinearFilter,
    PerspectiveCamera,
    TextureLoader
} from "three";
let assets = new Map();

import bleach_bypass from './static/images/lut/png/A/bleach-bypass.png';
import candle_light from './static/images/lut/png/A/candle-light.png';
import cool_contrast from './static/images/lut/png/A/cool-contrast.png';
import desaturated_fog from './static/images/lut/png/A/desaturated-fog.png';
import evening from './static/images/lut/png/A/evening.png';
import fall from './static/images/lut/png/A/fall.png';
import filmic1 from './static/images/lut/png/A/filmic1.png';
import filmic2 from './static/images/lut/png/A/filmic2.png';
import matrix_green from './static/images/lut/png/A/matrix-green.png';
import strong_amber from './static/images/lut/png/A/strong-amber.png';
import warm_contrast from './static/images/lut/png/A/warm-contrast.png';
import BleachAlternative from './static/images/lut/png/Base/BleachAlternative.PNG';
import BleachH from './static/images/lut/png/Base/BleachH.PNG';
import BleachL from './static/images/lut/png/Base/BleachL.PNG';
import BleachM from './static/images/lut/png/Base/BleachM.PNG';
import BlueContrast from './static/images/lut/png/Base/BlueContrast.PNG';
import BlueTint from './static/images/lut/png/Base/BlueTint.PNG';
import ColdH from './static/images/lut/png/Base/ColdH.PNG';
import ColdL from './static/images/lut/png/Base/ColdL.PNG';
import ColdM from './static/images/lut/png/Base/ColdM.PNG';
import ContrastA from './static/images/lut/png/Base/ContrastA.PNG';
import ContrastB from './static/images/lut/png/Base/ContrastB.PNG';
import ContrastC from './static/images/lut/png/Base/ContrastC.PNG';
import ContrastD from './static/images/lut/png/Base/ContrastD.PNG';
import Desaturate from './static/images/lut/png/Base/Desaturate.PNG';
import ExposureH from './static/images/lut/png/Base/ExposureH.PNG';
import ExposureL from './static/images/lut/png/Base/ExposureL.PNG';
import ExposureM from './static/images/lut/png/Base/ExposureM.PNG';
import GreenTint from './static/images/lut/png/Base/GreenTint.PNG';
import Invert from './static/images/lut/png/Base/Invert.PNG';
import LowContrastShadows from './static/images/lut/png/Base/LowContrastShadows.PNG';
import Normal from './static/images/lut/png/Base/Normal.PNG';
import RedTint from './static/images/lut/png/Base/RedTint.PNG';
import SharpWasteland from './static/images/lut/png/Base/SharpWasteland.PNG';
import StrongBlueTint from './static/images/lut/png/Base/StrongBlueTint.PNG';
import VibranceA from './static/images/lut/png/Base/VibranceA.PNG';
import VibranceB from './static/images/lut/png/Base/VibranceB.PNG';
import VibranceC from './static/images/lut/png/Base/VibranceC.PNG';
import VibranceD from './static/images/lut/png/Base/VibranceD.PNG';
import VibranceE from './static/images/lut/png/Base/VibranceE.PNG';
import WarmH from './static/images/lut/png/Base/WarmH.PNG';
import WarmL from './static/images/lut/png/Base/WarmL.PNG';
import WarmM from './static/images/lut/png/Base/WarmM.PNG';
import Deuteranopia from './static/images/lut/png/ColorBlindness/Deuteranopia.PNG';
import Doge from './static/images/lut/png/ColorBlindness/Doge.PNG';
import GrayLRed from './static/images/lut/png/ColorBlindness/GrayLRed.PNG';
import GrayMGreen from './static/images/lut/png/ColorBlindness/GrayMGreen.PNG';
import GraySBlue from './static/images/lut/png/ColorBlindness/GraySBlue.PNG';
import Protanopia from './static/images/lut/png/ColorBlindness/Protanopia.PNG';
import Tritanopia from './static/images/lut/png/ColorBlindness/Tritanopia.PNG';
import ActiveGreen from './static/images/lut/png/FilmColor/ActiveGreen.PNG';
import ActivePurple from './static/images/lut/png/FilmColor/ActivePurple.PNG';
import BlueHue from './static/images/lut/png/FilmColor/BlueHue.PNG';
import Desperado from './static/images/lut/png/FilmColor/Desperado.PNG';
import DustyOrange from './static/images/lut/png/FilmColor/DustyOrange.PNG';
import EndGame from './static/images/lut/png/FilmColor/EndGame.PNG';
import Jurassic from './static/images/lut/png/FilmColor/Jurassic.PNG';
import OldFilm from './static/images/lut/png/FilmColor/OldFilm.PNG';
import OldFilm2 from './static/images/lut/png/FilmColor/OldFilm2.PNG';
import OldFilm3 from './static/images/lut/png/FilmColor/OldFilm3.PNG';
import OldFilm4 from './static/images/lut/png/FilmColor/OldFilm4.PNG';
import OldFilm5 from './static/images/lut/png/FilmColor/OldFilm5.PNG';
import RaptorHunt from './static/images/lut/png/FilmColor/RaptorHunt.PNG';
import RedDawn from './static/images/lut/png/FilmColor/RedDawn.PNG';
import RobotAction from './static/images/lut/png/FilmColor/RobotAction.PNG';
import RobotReaction from './static/images/lut/png/FilmColor/RobotReaction.PNG';
import SettingSun from './static/images/lut/png/FilmColor/SettingSun.PNG';
import SoftOlderFootage from './static/images/lut/png/FilmColor/SoftOlderFootage.PNG';
import SoftOldFootage from './static/images/lut/png/FilmColor/SoftOldFootage.PNG';
import SoftOrange from './static/images/lut/png/FilmColor/SoftOrange.PNG';
import SummerAction from './static/images/lut/png/FilmColor/SummerAction.PNG';
import TheEnd from './static/images/lut/png/FilmColor/TheEnd.PNG';
import ToxicGreen from './static/images/lut/png/FilmColor/ToxicGreen.PNG';
import B_WHighContrast from './static/images/lut/png/FilmMono/B_WHighContrast.PNG';
import B_WHighContrastDigital from './static/images/lut/png/FilmMono/B_WHighContrastDigital.PNG';
import B_WHighContrastOld from './static/images/lut/png/FilmMono/B_WHighContrastOld.PNG';
import B_WLowContrastOld from './static/images/lut/png/FilmMono/B_WLowContrastOld.PNG';
import B_WSimple from './static/images/lut/png/FilmMono/B_WSimple.PNG';
import Sepia1 from './static/images/lut/png/FilmMono/Sepia1.PNG';
import Sepia2 from './static/images/lut/png/FilmMono/Sepia2.PNG';
import Sepia3 from './static/images/lut/png/FilmMono/Sepia3.PNG';
import T80sPost_ApocalypticAction from './static/images/lut/png/PopularLooks/80sPost-ApocalypticAction.PNG';
import T80sPost_ApocalypticDrama from './static/images/lut/png/PopularLooks/80sPost-ApocalypticDrama.PNG';
import BlindHero from './static/images/lut/png/PopularLooks/BlindHero.PNG';
import Blockbuster1 from './static/images/lut/png/PopularLooks/Blockbuster1.PNG';
import Blockbuster10 from './static/images/lut/png/PopularLooks/Blockbuster10.PNG';
import Blockbuster11 from './static/images/lut/png/PopularLooks/Blockbuster11.PNG';
import Blockbuster12 from './static/images/lut/png/PopularLooks/Blockbuster12.PNG';
import Blockbuster13 from './static/images/lut/png/PopularLooks/Blockbuster13.PNG';
import Blockbuster14 from './static/images/lut/png/PopularLooks/Blockbuster14.PNG';
import Blockbuster15 from './static/images/lut/png/PopularLooks/Blockbuster15.PNG';
import Blockbuster16 from './static/images/lut/png/PopularLooks/Blockbuster16.PNG';
import Blockbuster2 from './static/images/lut/png/PopularLooks/Blockbuster2.PNG';
import Blockbuster3 from './static/images/lut/png/PopularLooks/Blockbuster3.PNG';
import Blockbuster4 from './static/images/lut/png/PopularLooks/Blockbuster4.PNG';
import Blockbuster5 from './static/images/lut/png/PopularLooks/Blockbuster5.PNG';
import Blockbuster6 from './static/images/lut/png/PopularLooks/Blockbuster6.PNG';
import Blockbuster7 from './static/images/lut/png/PopularLooks/Blockbuster7.PNG';
import Blockbuster8 from './static/images/lut/png/PopularLooks/Blockbuster8.PNG';
import Blockbuster9 from './static/images/lut/png/PopularLooks/Blockbuster9.PNG';
import Chocolatier from './static/images/lut/png/PopularLooks/Chocolatier.PNG';
import DodgeThis from './static/images/lut/png/PopularLooks/DodgeThis.PNG';
import FinalFight from './static/images/lut/png/PopularLooks/FinalFight.PNG';
import FlowerPower from './static/images/lut/png/PopularLooks/FlowerPower.PNG';
import Furiosa from './static/images/lut/png/PopularLooks/Furiosa.PNG';
import Kuato from './static/images/lut/png/PopularLooks/Kuato.PNG';
import Max1 from './static/images/lut/png/PopularLooks/Max1.PNG';
import Max2 from './static/images/lut/png/PopularLooks/Max2.PNG';
import ModernDystopianAction from './static/images/lut/png/PopularLooks/ModernDystopianAction.PNG';
import Quaid from './static/images/lut/png/PopularLooks/Quaid.PNG';
import RobotSalvation from './static/images/lut/png/PopularLooks/RobotSalvation.PNG';
import Rohan from './static/images/lut/png/PopularLooks/Rohan.PNG';
import SimpleFilm from './static/images/lut/png/PopularLooks/SimpleFilm.PNG';
import Tina from './static/images/lut/png/PopularLooks/Tina.PNG';
import Tower from './static/images/lut/png/PopularLooks/Tower.PNG';
import WorldWar1 from './static/images/lut/png/PopularLooks/WorldWar1.PNG';
import F2AA3 from './static/images/lut/png/StockFilmBase/F2AA3.PNG';
import F2AA5 from './static/images/lut/png/StockFilmBase/F2AA5.PNG';
import F2BB3 from './static/images/lut/png/StockFilmBase/F2BB3.PNG';
import F2BB5 from './static/images/lut/png/StockFilmBase/F2BB5.PNG';
import F35A from './static/images/lut/png/StockFilmBase/F35A.PNG';
import F35B from './static/images/lut/png/StockFilmBase/F35B.PNG';
import F3AA0 from './static/images/lut/png/StockFilmBase/F3AA0.PNG';
import K1A from './static/images/lut/png/StockFilmBase/K1A.PNG';
import K1B from './static/images/lut/png/StockFilmBase/K1B.PNG';
import K23A from './static/images/lut/png/StockFilmBase/K23A.PNG';
import K23B from './static/images/lut/png/StockFilmBase/K23B.PNG';
import K5AA5 from './static/images/lut/png/StockFilmBase/K5AA5.PNG';
import K5AA8 from './static/images/lut/png/StockFilmBase/K5AA8.PNG';
import K5BB8 from './static/images/lut/png/StockFilmBase/K5BB8.PNG';
import Stock1 from './static/images/lut/png/StockFilmStandard/Stock1.PNG';
import Stock10 from './static/images/lut/png/StockFilmStandard/Stock10.PNG';
import Stock11 from './static/images/lut/png/StockFilmStandard/Stock11.PNG';
import Stock12 from './static/images/lut/png/StockFilmStandard/Stock12.PNG';
import Stock13 from './static/images/lut/png/StockFilmStandard/Stock13.PNG';
import Stock14 from './static/images/lut/png/StockFilmStandard/Stock14.PNG';
import Stock2 from './static/images/lut/png/StockFilmStandard/Stock2.PNG';
import Stock3 from './static/images/lut/png/StockFilmStandard/Stock3.PNG';
import Stock4 from './static/images/lut/png/StockFilmStandard/Stock4.PNG';
import Stock5 from './static/images/lut/png/StockFilmStandard/Stock5.PNG';
import Stock6 from './static/images/lut/png/StockFilmStandard/Stock6.PNG';
import Stock7 from './static/images/lut/png/StockFilmStandard/Stock7.PNG';
import Stock8 from './static/images/lut/png/StockFilmStandard/Stock8.PNG';
import Stock9 from './static/images/lut/png/StockFilmStandard/Stock9.PNG';
import Vintage1 from './static/images/lut/png/StockFilmVintage/Vintage1.PNG';
import Vintage10 from './static/images/lut/png/StockFilmVintage/Vintage10.PNG';
import Vintage11 from './static/images/lut/png/StockFilmVintage/Vintage11.PNG';
import Vintage12 from './static/images/lut/png/StockFilmVintage/Vintage12.PNG';
import Vintage2 from './static/images/lut/png/StockFilmVintage/Vintage2.PNG';
import Vintage3 from './static/images/lut/png/StockFilmVintage/Vintage3.PNG';
import Vintage4 from './static/images/lut/png/StockFilmVintage/Vintage4.PNG';
import Vintage5 from './static/images/lut/png/StockFilmVintage/Vintage5.PNG';
import Vintage6 from './static/images/lut/png/StockFilmVintage/Vintage6.PNG';
import Vintage7 from './static/images/lut/png/StockFilmVintage/Vintage7.PNG';
import Vintage8 from './static/images/lut/png/StockFilmVintage/Vintage8.PNG';
import Vintage9 from './static/images/lut/png/StockFilmVintage/Vintage9.PNG';
import T90sActionNY from './static/images/lut/png/StylizedMisc/90sActionNY.PNG';
import T90sBleach from './static/images/lut/png/StylizedMisc/90sBleach.PNG';
import T90sBleachStrongContrast from './static/images/lut/png/StylizedMisc/90sBleachStrongContrast.PNG';
import T90sGreen from './static/images/lut/png/StylizedMisc/90sGreen.PNG';
import Aliens1 from './static/images/lut/png/StylizedMisc/Aliens1.PNG';
import Aliens2 from './static/images/lut/png/StylizedMisc/Aliens2.PNG';
import Aliens3 from './static/images/lut/png/StylizedMisc/Aliens3.PNG';
import Aliens4 from './static/images/lut/png/StylizedMisc/Aliens4.PNG';
import ColdIsolation from './static/images/lut/png/StylizedMisc/ColdIsolation.PNG';
import ColorShift from './static/images/lut/png/StylizedMisc/ColorShift.PNG';
import CorruptedGreen from './static/images/lut/png/StylizedMisc/CorruptedGreen.PNG';
import CorruptedNight from './static/images/lut/png/StylizedMisc/CorruptedNight.PNG';
import CorruptedPurple from './static/images/lut/png/StylizedMisc/CorruptedPurple.PNG';
import CyanHaze from './static/images/lut/png/StylizedMisc/CyanHaze.PNG';
import DarkEdge from './static/images/lut/png/StylizedMisc/DarkEdge.PNG';
import DarkRedHaze from './static/images/lut/png/StylizedMisc/DarkRedHaze.PNG';
import DayNight from './static/images/lut/png/StylizedMisc/DayNight.PNG';
import Desert1 from './static/images/lut/png/StylizedMisc/Desert1.PNG';
import Desert2 from './static/images/lut/png/StylizedMisc/Desert2.PNG';
import Desert3 from './static/images/lut/png/StylizedMisc/Desert3.PNG';
import Desert4 from './static/images/lut/png/StylizedMisc/Desert4.PNG';
import Dopefish from './static/images/lut/png/StylizedMisc/Dopefish.PNG';
import GreenIsolation from './static/images/lut/png/StylizedMisc/GreenIsolation.PNG';
import GreenIsolation2 from './static/images/lut/png/StylizedMisc/GreenIsolation2.PNG';
import LowGreen from './static/images/lut/png/StylizedMisc/LowGreen.PNG';
import Nightfall from './static/images/lut/png/StylizedMisc/Nightfall.PNG';
import PurpleRain from './static/images/lut/png/StylizedMisc/PurpleRain.PNG';
import SettingSun1 from './static/images/lut/png/StylizedMisc/SettingSun.PNG';
import SrongMoonLight from './static/images/lut/png/StylizedMisc/SrongMoonLight.PNG';
import StrongGreen from './static/images/lut/png/StylizedMisc/StrongGreen.PNG';
import Underwater from './static/images/lut/png/StylizedMisc/Underwater.PNG';
import WarmIsolation from './static/images/lut/png/StylizedMisc/WarmIsolation.PNG';
import Winter from './static/images/lut/png/StylizedMisc/Winter.PNG';
import Atri from './static/images/lut/png/StylizedRetro/Atri.PNG';
import B_WComicBook from './static/images/lut/png/StylizedRetro/B_WComicBook.PNG';
import B_WComicBookExtreme from './static/images/lut/png/StylizedRetro/B_WComicBookExtreme.PNG';
import DiffusionNoise from './static/images/lut/png/StylizedRetro/DiffusionNoise.PNG';
import Friend from './static/images/lut/png/StylizedRetro/Friend.PNG';
import FriendDiffusion from './static/images/lut/png/StylizedRetro/FriendDiffusion.PNG';
import Gamebob1 from './static/images/lut/png/StylizedRetro/Gamebob1.PNG';
import Gamebob2 from './static/images/lut/png/StylizedRetro/Gamebob2.PNG';
import GamebobAC from './static/images/lut/png/StylizedRetro/GamebobAC.PNG';
import GamebobACDiffusion from './static/images/lut/png/StylizedRetro/GamebobACDiffusion.PNG';
import GamebobColor from './static/images/lut/png/StylizedRetro/GamebobColor.PNG';
import GamebobColorDiffusion from './static/images/lut/png/StylizedRetro/GamebobColorDiffusion.PNG';
import Nest from './static/images/lut/png/StylizedRetro/Nest.PNG';
import NestDiffusion from './static/images/lut/png/StylizedRetro/NestDiffusion.PNG';
import P4 from './static/images/lut/png/StylizedRetro/P4.PNG';
import P4Diffusion from './static/images/lut/png/StylizedRetro/P4Diffusion.PNG';
import Posterize1 from './static/images/lut/png/StylizedRetro/Posterize1.PNG';
import Posterize2 from './static/images/lut/png/StylizedRetro/Posterize2.PNG';
import Posterize3 from './static/images/lut/png/StylizedRetro/Posterize3.PNG';
import Sanic1 from './static/images/lut/png/StylizedRetro/Sanic1.PNG';
import Sanic1Diffusion from './static/images/lut/png/StylizedRetro/Sanic1Diffusion.PNG';
import Sanic2 from './static/images/lut/png/StylizedRetro/Sanic2.PNG';
import Sanic2Diffusion from './static/images/lut/png/StylizedRetro/Sanic2Diffusion.PNG';
import Shareware from './static/images/lut/png/StylizedRetro/Shareware.PNG';
import SpectrumLove1 from './static/images/lut/png/StylizedRetro/SpectrumLove1.PNG';
import SpectrumLove2 from './static/images/lut/png/StylizedRetro/SpectrumLove2.PNG';
import TinyPalette from './static/images/lut/png/StylizedRetro/TinyPalette.PNG';
import ZX from './static/images/lut/png/StylizedRetro/ZX.PNG';
import ZXDiffusion from './static/images/lut/png/StylizedRetro/ZXDiffusion.PNG';

// let luts = new Map([
//   ['bleach_bypass', bleach_bypass],
//   ['candle_light', candle_light],
//   ['cool_contrast', cool_contrast],
//   ['desaturated_fog', desaturated_fog],
//   ['evening', evening],
//   ['fall', fall],
//   ['filmic1', filmic1],
//   ['filmic2', filmic2],
//   ['matrix_green', matrix_green],
//   ['strong_amber', strong_amber],
//   ['warm_contrast', warm_contrast],
//   ['BleachAlternative', BleachAlternative],
//   ['BleachH', BleachH],
//   ['BleachL', BleachL],
//   ['BleachM', BleachM],
//   ['BlueContrast', BlueContrast],
//   ['BlueTint', BlueTint],
//   ['ColdH', ColdH],
//   ['ColdL', ColdL],
//   ['ColdM', ColdM],
//   ['ContrastA', ContrastA],
//   ['ContrastB', ContrastB],
//   ['ContrastC', ContrastC],
//   ['ContrastD', ContrastD],
//   ['Desaturate', Desaturate],
//   ['ExposureH', ExposureH],
//   ['ExposureL', ExposureL],
//   ['ExposureM', ExposureM],
//   ['GreenTint', GreenTint],
//   ['Invert', Invert],
//   ['LowContrastShadows', LowContrastShadows],
//   ['Normal', Normal],
//   ['RedTint', RedTint],
//   ['SharpWasteland', SharpWasteland],
//   ['StrongBlueTint', StrongBlueTint],
//   ['VibranceA', VibranceA],
//   ['VibranceB', VibranceB],
//   ['VibranceC', VibranceC],
//   ['VibranceD', VibranceD],
//   ['VibranceE', VibranceE],
//   ['WarmH', WarmH],
//   ['WarmL', WarmL],
//   ['WarmM', WarmM],
//   ['Deuteranopia', Deuteranopia],
//   ['Doge', Doge],
//   ['GrayLRed', GrayLRed],
//   ['GrayMGreen', GrayMGreen],
//   ['GraySBlue', GraySBlue],
//   ['Protanopia', Protanopia],
//   ['Tritanopia', Tritanopia],
//   ['ActiveGreen', ActiveGreen],
//   ['ActivePurple', ActivePurple],
//   ['BlueHue', BlueHue],
//   ['Desperado', Desperado],
//   ['DustyOrange', DustyOrange],
//   ['EndGame', EndGame],
//   ['Jurassic', Jurassic],
//   ['OldFilm', OldFilm],
//   ['OldFilm2', OldFilm2],
//   ['OldFilm3', OldFilm3],
//   ['OldFilm4', OldFilm4],
//   ['OldFilm5', OldFilm5],
//   ['RaptorHunt', RaptorHunt],
//   ['RedDawn', RedDawn],
//   ['RobotAction', RobotAction],
//   ['RobotReaction', RobotReaction],
//   ['SettingSun1', SettingSun1],
//   ['SoftOlderFootage', SoftOlderFootage],
//   ['SoftOldFootage', SoftOldFootage],
//   ['SoftOrange', SoftOrange],
//   ['SummerAction', SummerAction],
//   ['TheEnd', TheEnd],
//   ['ToxicGreen', ToxicGreen],
//   ['B_WHighContrast', B_WHighContrast],
//   ['B_WHighContrastDigital', B_WHighContrastDigital],
//   ['B_WHighContrastOld', B_WHighContrastOld],
//   ['B_WLowContrastOld', B_WLowContrastOld],
//   ['B_WSimple', B_WSimple],
//   ['Sepia1', Sepia1],
//   ['Sepia2', Sepia2],
//   ['Sepia3', Sepia3],
//   ['T80sPost_ApocalypticAction', T80sPost_ApocalypticAction],
//   ['T80sPost_ApocalypticDrama', T80sPost_ApocalypticDrama],
//   ['BlindHero', BlindHero],
//   ['Blockbuster1', Blockbuster1],
//   ['Blockbuster10', Blockbuster10],
//   ['Blockbuster11', Blockbuster11],
//   ['Blockbuster12', Blockbuster12],
//   ['Blockbuster13', Blockbuster13],
//   ['Blockbuster14', Blockbuster14],
//   ['Blockbuster15', Blockbuster15],
//   ['Blockbuster16', Blockbuster16],
//   ['Blockbuster2', Blockbuster2],
//   ['Blockbuster3', Blockbuster3],
//   ['Blockbuster4', Blockbuster4],
//   ['Blockbuster5', Blockbuster5],
//   ['Blockbuster6', Blockbuster6],
//   ['Blockbuster7', Blockbuster7],
//   ['Blockbuster8', Blockbuster8],
//   ['Blockbuster9', Blockbuster9],
//   ['Chocolatier', Chocolatier],
//   ['DodgeThis', DodgeThis],
//   ['FinalFight', FinalFight],
//   ['FlowerPower', FlowerPower],
//   ['Furiosa', Furiosa],
//   ['Kuato', Kuato],
//   ['Max1', Max1],
//   ['Max2', Max2],
//   ['ModernDystopianAction', ModernDystopianAction],
//   ['Quaid', Quaid],
//   ['RobotSalvation', RobotSalvation],
//   ['Rohan', Rohan],
//   ['SimpleFilm', SimpleFilm],
//   ['Tina', Tina],
//   ['Tower', Tower],
//   ['WorldWar1', WorldWar1],
//   ['F2AA3', F2AA3],
//   ['F2AA5', F2AA5],
//   ['F2BB3', F2BB3],
//   ['F2BB5', F2BB5],
//   ['F35A', F35A],
//   ['F35B', F35B],
//   ['F3AA0', F3AA0],
//   ['K1A', K1A],
//   ['K1B', K1B],
//   ['K23A', K23A],
//   ['K23B', K23B],
//   ['K5AA5', K5AA5],
//   ['K5AA8', K5AA8],
//   ['K5BB8', K5BB8],
//   ['Stock1', Stock1],
//   ['Stock10', Stock10],
//   ['Stock11', Stock11],
//   ['Stock12', Stock12],
//   ['Stock13', Stock13],
//   ['Stock14', Stock14],
//   ['Stock2', Stock2],
//   ['Stock3', Stock3],
//   ['Stock4', Stock4],
//   ['Stock5', Stock5],
//   ['Stock6', Stock6],
//   ['Stock7', Stock7],
//   ['Stock8', Stock8],
//   ['Stock9', Stock9],
//   ['Vintage1', Vintage1],
//   ['Vintage10', Vintage10],
//   ['Vintage11', Vintage11],
//   ['Vintage12', Vintage12],
//   ['Vintage2', Vintage2],
//   ['Vintage3', Vintage3],
//   ['Vintage4', Vintage4],
//   ['Vintage5', Vintage5],
//   ['Vintage6', Vintage6],
//   ['Vintage7', Vintage7],
//   ['Vintage8', Vintage8],
//   ['Vintage9', Vintage9],
//   ['T90sActionNY', T90sActionNY],
//   ['T90sBleach', T90sBleach],
//   ['T90sBleachStrongContrast', T90sBleachStrongContrast],
//   ['T90sGreen', T90sGreen],
//   ['Aliens1', Aliens1],
//   ['Aliens2', Aliens2],
//   ['Aliens3', Aliens3],
//   ['Aliens4', Aliens4],
//   ['ColdIsolation', ColdIsolation],
//   ['ColorShift', ColorShift],
//   ['CorruptedGreen', CorruptedGreen],
//   ['CorruptedNight', CorruptedNight],
//   ['CorruptedPurple', CorruptedPurple],
//   ['CyanHaze', CyanHaze],
//   ['DarkEdge', DarkEdge],
//   ['DarkRedHaze', DarkRedHaze],
//   ['DayNight', DayNight],
//   ['Desert1', Desert1],
//   ['Desert2', Desert2],
//   ['Desert3', Desert3],
//   ['Desert4', Desert4],
//   ['Dopefish', Dopefish],
//   ['GreenIsolation', GreenIsolation],
//   ['GreenIsolation2', GreenIsolation2],
//   ['LowGreen', LowGreen],
//   ['Nightfall', Nightfall],
//   ['PurpleRain', PurpleRain],
//   ['SettingSun', SettingSun],
//   ['SrongMoonLight', SrongMoonLight],
//   ['StrongGreen', StrongGreen],
//   ['Underwater', Underwater],
//   ['WarmIsolation', WarmIsolation],
//   ['Winter', Winter],
//   ['Atri', Atri],
//   ['B_WComicBook', B_WComicBook],
//   ['B_WComicBookExtreme', B_WComicBookExtreme],
//   ['DiffusionNoise', DiffusionNoise],
//   ['Friend', Friend],
//   ['FriendDiffusion', FriendDiffusion],
//   ['Gamebob1', Gamebob1],
//   ['Gamebob2', Gamebob2],
//   ['GamebobAC', GamebobAC],
//   ['GamebobACDiffusion', GamebobACDiffusion],
//   ['GamebobColor', GamebobColor],
//   ['GamebobColorDiffusion', GamebobColorDiffusion],
//   ['Nest', Nest],
//   ['NestDiffusion', NestDiffusion],
//   ['P4', P4],
//   ['P4Diffusion', P4Diffusion],
//   ['Posterize1', Posterize1],
//   ['Posterize2', Posterize2],
//   ['Posterize3', Posterize3],
//   ['Sanic1', Sanic1],
//   ['Sanic1Diffusion', Sanic1Diffusion],
//   ['Sanic2', Sanic2],
//   ['Sanic2Diffusion', Sanic2Diffusion],
//   ['Shareware', Shareware],
//   ['SpectrumLove1', SpectrumLove1],
//   ['SpectrumLove2', SpectrumLove2],
//   ['TinyPalette', TinyPalette],
//   ['ZX', ZX],
//   ['ZXDiffusion', ZXDiffusion]
// ]);

let luts = new Map([
    ['ExposureM', ExposureM],
    ['VibranceA', VibranceA],
    ['cool_contrast', cool_contrast]
]);

function load() {
    const textureLoader = new TextureLoader();
    const lut3dlLoader = new LUT3dlLoader();
    const lutCubeLoader = new LUTCubeLoader();


    // 只处理非 null 的条目
    const entriesToLoad = Array.from(luts.entries()).filter(([_, path]) => path !== null);

    // 将每个加载任务封装成一个 Promise
    const loadPromises = entriesToLoad.map(([key, path]) => {
        return new Promise((resolve, reject) => {
            let loader = textureLoader;
            loader.load(
                path,
                // 成功回调
                (texture) => {
                    texture.name = key;

                    // 针对普通纹理设置参数
                    texture.generateMipmaps = false;
                    texture.minFilter = LinearFilter;
                    texture.magFilter = LinearFilter;
                    texture.wrapS = ClampToEdgeWrapping;
                    texture.wrapT = ClampToEdgeWrapping;
                    texture.flipY = false;

                    assets.set(key, texture);
                    resolve(texture);
                },
                // 进度回调（可选）
                undefined,
                // 错误回调
                (error) => {
                    console.error(`加载失败: ${key} (${fullPath})`);
                    console.error(error);
                    reject(error);
                }
            );
        });
    });

    // 等待所有加载完成
    return Promise.all(loadPromises);
}
function detectMobileOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 检测是否为 iOS 设备（iPhone, iPad, iPod）
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // 检测是否为 Android 设备
    const isAndroid = /android/i.test(userAgent);

    if (isIOS) {
        return "ios";
    } else if (isAndroid) {
        return "android";
    } else {
        return "other";
    }
}

let lutEffect;
function addColorGradingPass(scene, camera, renderer, composer, gui, enableControl) {
    const texture = load().then(() => {
        const capabilities = renderer.capabilities;

        const brightnessContrastEffect = new BrightnessContrastEffect({
            blendFunction: BlendFunction.SKIP
        });

        const hueSaturationEffect = new HueSaturationEffect({
            blendFunction: BlendFunction.SET,
            saturation: 0.11,
            hue: 0.0
        });

        const lut = LookupTexture3D.from(assets.get("ExposureM"));
        lutEffect = capabilities.isWebGL2 ? new LUT3DEffect(lut) :
            new LUT3DEffect(lut.convertToUint8().toDataTexture());
        if (detectMobileOS() === 'ios')
        {
            lutEffect.blendFunction = BlendFunction.SKIP;
        }
        // lutEffect.inputColorSpace = LinearSRGBColorSpace; // Debug
        const pass = new EffectPass(camera,
            brightnessContrastEffect,
            hueSaturationEffect,
            lutEffect
        );

        if (enableControl) {
            const params = {
                brightnessContrast: {
                    "brightness": brightnessContrastEffect.uniforms.get("brightness").value,
                    "contrast": brightnessContrastEffect.uniforms.get("contrast").value,
                    "opacity": brightnessContrastEffect.blendMode.opacity.value,
                    "blend mode": brightnessContrastEffect.blendMode.blendFunction
                },
                hueSaturation: {
                    "hue": 0.0,
                    "saturation": hueSaturationEffect.uniforms.get("saturation").value,
                    "opacity": hueSaturationEffect.blendMode.opacity.value,
                    "blend mode": hueSaturationEffect.blendMode.blendFunction
                },
                lut: {
                    "LUT": lutEffect.getLUT().name,
                    "base size": lutEffect.getLUT().image.width,
                    "3D texture": true,
                    "tetrahedral filter": false,
                    "scale up": false,
                    "target size": 48,
                    "show LUT": false,
                    "opacity": lutEffect.blendMode.opacity.value,
                    "blend mode": lutEffect.blendMode.blendFunction
                }
            };

            let objectURL = null;

            function changeLUT() {

                const original = assets.get(params.lut.LUT);
                const size = Math.min(original.image.width, original.image.height);
                const targetSize = params.lut["target size"];
                const scaleUp = params.lut["scale up"] && (targetSize > size);

                let promise;

                if (scaleUp) {

                    const lut = original.isLookupTexture3D ? original :
                        LookupTexture3D.from(original);

                    console.time("Tetrahedral Upscaling");
                    promise = lut.scaleUp(targetSize, false);
                    document.body.classList.add("progress");

                } else {

                    promise = Promise.resolve(LookupTexture3D.from(original));

                }

                promise.then((lut) => {

                    if (scaleUp) {

                        console.timeEnd("Tetrahedral Upscaling");
                        document.body.classList.remove("progress");

                    }

                    lutEffect.getLUT().dispose();
                    params.lut["base size"] = size;

                    if (capabilities.isWebGL2) {
                        lutEffect.setLUT(params.lut["3D texture"] ?
                            lut : lut.toDataTexture());

                    } else {

                        lutEffect.setLUT(lut.convertToUint8().toDataTexture());

                    }

                }).catch((error) => console.error(error));

            }

            const infoOptions = [];
            let ff = gui.addFolder('color grading');

            let f = ff.addFolder("Brightness & Contrast");

            f.add(params.brightnessContrast, "brightness", -1.0, 1.0, 0.001)
                .onChange((value) => {

                    brightnessContrastEffect.uniforms.get("brightness").value = value;

                });

            f.add(params.brightnessContrast, "contrast", -1.0, 1.0, 0.001)
                .onChange((value) => {

                    brightnessContrastEffect.uniforms.get("contrast").value = value;

                });

            f.add(params.brightnessContrast, "opacity", 0.0, 1.0, 0.01)
                .onChange((value) => {

                    brightnessContrastEffect.blendMode.opacity.value = value;

                });

            f.add(params.brightnessContrast, "blend mode", BlendFunction)
                .onChange((value) => {

                    brightnessContrastEffect.blendMode.setBlendFunction(Number(value));

                });

            f = ff.addFolder("Hue & Saturation");

            f.add(params.hueSaturation, "hue", 0.0, Math.PI * 2.0, 0.001)
                .onChange((value) => {

                    hueSaturationEffect.setHue(value);

                });

            f.add(params.hueSaturation, "saturation", -1.0, 1.0, 0.001)
                .onChange((value) => {

                    hueSaturationEffect.uniforms.get("saturation").value = value;

                });

            f.add(params.hueSaturation, "opacity", 0.0, 1.0, 0.01)
                .onChange((value) => {

                    hueSaturationEffect.blendMode.opacity.value = value;

                });

            f.add(params.hueSaturation, "blend mode", BlendFunction)
                .onChange((value) => {

                    hueSaturationEffect.blendMode.setBlendFunction(Number(value));

                });

            f = ff.addFolder("Lookup Texture 3D");

            f.add(params.lut, "LUT", [...luts.keys()]).onChange(changeLUT);

            infoOptions.push(f.add(params.lut, "base size").listen());

            if (capabilities.isWebGL2) {

                f.add(params.lut, "3D texture").onChange(changeLUT);
                f.add(params.lut, "tetrahedral filter").onChange((value) => {

                    lutEffect.setTetrahedralInterpolationEnabled(value);

                });

            }

            f.add(params.lut, "scale up").onChange(changeLUT);
            f.add(params.lut, "target size", [32, 48, 64, 96, 128]).onChange(changeLUT);

            f.add(params.lut, "opacity", 0.0, 1.0, 0.01).onChange((value) => {

                lutEffect.blendMode.opacity.value = value;

            });

            f.add(params.lut, "blend mode", BlendFunction).onChange((value) => {

                lutEffect.blendMode.setBlendFunction(Number(value));

            });

            f.open();

            for (const option of infoOptions) {

                option.domElement.style.pointerEvents = "none";

            }

        }

        composer.addPass(pass);

    });

};

let cur = 0;
function next() {
    cur += 1;
    if (cur >= luts.size) {
        cur = 0;
    }
    let index = 0;
    for (const [key, value] of luts) {
        if (index === cur) { // 找第 2 个元素
            lutEffect.setLUT(assets.get(key));
            console.log(key);
            break;
        }
        index++;
    }
}

function last() {
    cur -= 1;
    if (cur < 0) {
        cur = luts.size - 1;
    }
    let index = 0;
    for (const [key, value] of luts) {
        if (index === cur) { // 找第 2 个元素
            lutEffect.setLUT(assets.get(key));
            console.log(key);
            break;
        }
        index++;
    }
}

let show = true;
function toggle() {
    if (show) {
        lutEffect.blendMode.blendFunction = BlendFunction.SET;
        show = false;
    }
    else {
        lutEffect.blendMode.blendFunction = BlendFunction.SKIP;
        show = true;

    }
}

export { addColorGradingPass, next, last, toggle };