window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('User granted access to MetaMask');
        } catch (error) {
            console.error('User denied access to MetaMask', error);
        }
    } else {
        console.log('MetaMask is not installed. Please install MetaMask to use this dApp.');
    }
});
