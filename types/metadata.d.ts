
interface CollectionInfo {
  collectionName: string;
  collectionDescription: string;
  collectionLogoURL: string;
  collectionFeaturedImageURL: string;
  collectionBannerImageURL: string;
  collectionCategory: string;
}

interface SocialData {
  socialName: string;
  socialAddress: string;
  _id: string;
}

interface Royality {
  address: string;
  amount: number;
  _id: string;
}

interface LocalStorageMetadata {
  socialData: SocialData[];
  royality: Royality[];
  collectionName: string;
  collectionDescription: string;
  collectionCategory: string;
  collectionLogoUrl: string;
  collectionFeaturedImageUrl: string;
  collectionBannerImageUrl: string;
  collectionSize: string;
  custom_token_id: string;
  pool_amount: string;
  premint_amount: string;
  whitelistToken_amount: string;
  custom_token_amount: string;
  mintPrice: number;
  isNeverEx: boolean;
  isCollectionBurn: boolean;
  isCollectionReturn: boolean;
  usePool: boolean;
  isPremint: boolean;
  isWhitelistToken: boolean;
  isWhitelistByPass: boolean;
  isCustomToken: boolean;
  isAcceptErgoToken: boolean;
  minDateTime: number;
  maxDateTime: number;
}

interface ServiceConf {
  liliumFeeAddress: string;
  liliumFeePercent: number;
  extraFeaturePercent: number;
  minBoxValueNanoErg: number;
  minerFeeNanoErg: number;
  minTxOperatorFeeNanoErg: number;
  dataBaseURL: string;
}

interface CoinGeckoErgoPrice {
  ergo: {
    usd: number;
  };
}
interface ResponseContract {
  artistTransaction: string;
  stateContract: {
    contract: string;
    singleton: {
      tokenID: string;
      tokenAmount: number;
    };
  };
  issuerContract: {
    contract: string;
    singleton: {
      tokenID: string;
      tokenAmount: number;
    };
  };
}

interface CollectionSubmission {
  Contracts: ResponseContract
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  imageSHA256: string;
  dna: string;
  edition: number;
  assetType: string;
  explicit: boolean;
  attributes: NftAttribute[];
  levels: NftLevel[];
  stats: NftStat[];
}

interface NftAttribute {
  trait_type: string;
  value: string;
}

interface NftLevel {
  trait_type: string;
  max_value: string;
  value: string;
}

interface NftStat {
  trait_type: string;
  max_value: string;
  value: string;
}


interface Royalty{
    address: string;
    amount: number;
}

interface CollectionData {
  collectionInfo: {
    collectionName: string;
    collectionDescription: string;
    collectionLogoURL: string;
    collectionFeaturedImageURL: string;
    collectionBannerImageURL: string;
    collectionCategory: string;
  };
  socialMedia: { [k: string]: string; };
  royalty: Royalty[];
  saleStartTimestamp: number;
  saleEndTimestamp: number;
  mintingExpiry: number;
  collectionMaxSize: number;
  priceOfNFTNanoErg: number;
  paymentTokenAmount: number;
  paymentTokenID: string;
  returnCollectionTokensToArtist: boolean;
  whitelistAccepted: boolean;
  whitelistBypass: boolean;
  premintAccepted: boolean;
  paymentTokenAccepted: boolean;
  ergAccepted: boolean;
  whitelistTokenAmount: number;
  premintTokenAmount: number;
  usePool: boolean;
  amountLP: number;
}

interface SubmissionData {
  transactionId: string,
  userPK: string,
  collectionDetails: CollectionData,
  nft: NftMetadata[]
}

interface ContractData {
  singletonIssuerContractUsePool: string;
  singletonIssuerContractNoPool: string;
  collectionIssuerContract: string;
  preMintIssuerContract: string;
  whitelistIssuerContract: string;
  proxyContract: string;
  minerFeeNanoErg: number;
}







