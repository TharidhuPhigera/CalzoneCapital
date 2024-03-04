import { useEffect } from 'react';

const TwelveDataWebSocket = ({ symbols, onMessage }) => {
  useEffect(() => {
    const socket = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=7b5861f61d974edeb58bd9da0cc76789`);

    socket.addEventListener('open', (event) => {
      // console.log('WebSocket Connection Opened:', event);
      socket.send(JSON.stringify({
        action: 'subscribe',
        params: { symbols: symbols.join(',') }
      }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      // console.log('WebSocket Message Received:', data);
      onMessage(data);
    });

    // socket.addEventListener('close', (event) => {
    //   console.log('WebSocket Connection Closed:', event);
    // });

    return () => {
      socket.close();
      // console.log('WebSocket Connection Closed: Cleanup');
    };
  }, [symbols, onMessage]);

  return null;
};

export default TwelveDataWebSocket;
