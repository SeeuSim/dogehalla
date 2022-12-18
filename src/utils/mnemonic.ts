import { env } from "../env/server.mjs";
import { prisma } from "../server/db/client";

enum MnemonicResponse__CollectionType {
  "TOKEN_TYPE_UNKNOWN",
  "TOKEN_TYPE_ERC20",
  "TOKEN_TYPE_ERC721",
  "TOKEN_TYPE_ERC1155",
  "TOKEN_TYPE_ERC721_LEGACY",
  "TOKEN_TYPE_CRYPTOPUNKS"
}

enum MnemonicResponse__CollectionMeta__Metadata__Type {
  "TYPE_BANNER_IMAGE_URL", 
  "TYPE_DESCRIPTION", 
  "TYPE_IMAGE_URL", 
  "TYPE_DISCORD_URL", 
  "TYPE_EXTERNAL_URL", 
  "TYPE_MEDIUM_USERNAME",
  "TYPE_TELEGRAM_URL", 
  "TYPE_TWITTER_USERNAME", 
  "TYPE_INSTAGRAM_USERNAME", 
  "TYPE_WIKI_URL"
}

type MnemonicResponse__CollectionMeta = {
  types: Array<MnemonicResponse__CollectionType>,
  name: string,
  tokensCount: string,
  ownersCount: string,
  salesVolume: string,
  metadata: Array<{
    type: MnemonicResponse__CollectionMeta__Metadata__Type,
    value: string
  }>
}

async function getCollectionMeta(contractAddress: string): Promise<MnemonicResponse__CollectionMeta> {
  return fetch(
    `https://ethereum.rest.mnemonichq.com/contracts/v1beta1/nft/metadata/${contractAddress}`,
    {
      method: 'GET',
      headers: {
        'X-API-Key': env.MNEMONIC_API_KEY as string
      }
    }
  )
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__CollectionMeta>;
  });
}

function populateCollections() {
  // const created = await prisma.collection.createMany({
  //   data: [
      
  //   ]
  // })
}