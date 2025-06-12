import {ExtractorInfo} from '../../../domain/entities/ExtractorInfo';
import JWPlayerInfo from './video/JWPlayer';
import VidHideExtractorInfo from './video/VidHideExtractor';
import AsianLoadInfo from './video/AsianLoad';
import BilibiliExtractorInfo from './video/Bilibili';
import FilemoonInfo from './video/Filemoon';
import GogoCDNInfo from './video/GogoCdn';
import KwikInfo from './video/Kwik';
import MegaUpInfo from './video/MegaUp';
import MixDropInfo from './video/MixDrop';
import Mp4PlayerInfo from './video/Mp4Player';
import Mp4UploadInfo from './video/Mp4Upload';
import RapidCloudInfo from './video/RapidCloud';
import SmashyStreamInfo from './video/SmashyStream';
import StreamHubInfo from './video/StreamHub';
import StreamLareInfo from './video/StreamLare';
import StreamSBInfo from './video/StreamSb';
import StreamTapeInfo from './video/StreamTape';
import StreamWishInfo from './video/StreamWish';
import VidCloudInfo from './video/VidCloud';
import VidMolyInfo from './video/VidMoly';
import VizCloudInfo from './video/VizCloud';
import VoeInfo from './video/Voe';

const Extractors = {
  ExtractorVideo: [
    new VidHideExtractorInfo(),
    new JWPlayerInfo(),
    new AsianLoadInfo(),
    new FilemoonInfo(),
    new GogoCDNInfo(),
    new BilibiliExtractorInfo(),
    new KwikInfo(),
    new MegaUpInfo(),
    new MixDropInfo(),
    new Mp4PlayerInfo(),
    new Mp4UploadInfo(),
    new RapidCloudInfo(),
    new SmashyStreamInfo(),
    new StreamHubInfo(),
    new StreamLareInfo(),
    new StreamSBInfo(),
    new StreamTapeInfo(),
    new StreamWishInfo(),
    new VidCloudInfo(),
    new VidMolyInfo(),
    new VizCloudInfo(),
    new VoeInfo(),
  ] as ExtractorInfo[],
  Other: [],
};

export default Extractors;
