import NodeGeocoder from 'node-geocoder';
import keys from '../config/keys.js';

const { GEOCODER_PROVIDER, GEOCODER_API_KEY } = keys;

const options = {
  provider: GEOCODER_PROVIDER,
  httpAdapter: 'https', // Default
  apiKey: GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null
};

const geocoder = NodeGeocoder(options);

export default geocoder;
