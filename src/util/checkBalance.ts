import {
  contractAddress,
  erc1155TokenId,
  minimumBalance,
} from 'const/yourDetails';
import { BigNumber } from 'ethers';

export default async function checkBalance(sdk, address) {
  const contract = await sdk.getContract(
    contractAddress // replace this with your contract address
  );

  let balance: BigNumber;
  balance = await contract.call(
    'balanceOf', // Name of your function as it is on the smart contract
    // Arguments to your function, in the same order they are on your smart contract
    [
      address, // Argument 1
      erc1155TokenId, // Argument 2
    ]
  );

  console.log('number of nfts:', balance.toNumber());
  console.log(balance.gte(minimumBalance));
  // gte = greater than or equal to
  return { hasNft: balance.gte(minimumBalance), quantity: balance.toNumber() };

  // For testing
  // return { hasNft: true, quantity: 1 };
}
