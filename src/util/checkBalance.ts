import {
  contractAddress,
  erc1155TokenId,
  erc1155TokenIdFounding,
  erc1155TokenIdFirst,
  minimumBalance,
} from 'const/yourDetails';
import { BigNumber } from 'ethers';

export default async function checkBalance(sdk, address) {
  const contract = await sdk.getContract(
    contractAddress // replace this with your contract address
  );

  let balanceCitizen: BigNumber;
  let balanceFounding: BigNumber;
  let balanceFirst: BigNumber;

  balanceCitizen = await contract.call(
    'balanceOf', // Name of your function as it is on the smart contract
    // Arguments to your function, in the same order they are on your smart contract
    [
      address, // Argument 1
      erc1155TokenId, // Argument 2
    ]
  );

  balanceFounding = await contract.call(
    'balanceOf', // Name of your function as it is on the smart contract
    // Arguments to your function, in the same order they are on your smart contract
    [
      address, // Argument 1
      erc1155TokenIdFounding, // Argument 2
    ]
  );

  balanceFirst = await contract.call(
    'balanceOf', // Name of your function as it is on the smart contract
    // Arguments to your function, in the same order they are on your smart contract
    [
      address, // Argument 1
      erc1155TokenIdFirst, // Argument 2
    ]
  );

  let hasAccess = false;

  if (
    balanceCitizen.gte(minimumBalance) ||
    balanceFounding.gte(minimumBalance) ||
    balanceFirst.gte(minimumBalance)
  ) {
    hasAccess = true;
  } else {
    hasAccess = false;
  }

  console.log(hasAccess);

  // console.log('number of nfts:', balance.toNumber());
  // console.log(balance.gte(minimumBalance));

  // gte = greater than or equal to
  return {
    hasNft: hasAccess,
    quantityCitizen: balanceCitizen.toNumber(),
    quantityFounding: balanceFounding.toNumber(),
    quantityFirst: balanceFirst.toNumber(),
  };

  // For testing
  // return { hasNft: true, quantity: 1 };
}
