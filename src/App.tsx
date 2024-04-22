import { useEffect, useState } from 'react';
import './App.css';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

function App() {
  const [connectionSignal, setConnectionSignal] = useState<HubConnection>();
  const [newNotification, setNewNotification] = useState<string[]>([]);

  useEffect(() => {
    const con = new HubConnectionBuilder()
      .withUrl('https://localhost:7062/hub/v1/notification')
      .build();

    con
      .start()
      .then(() => {
        console.log('Connection suceffully');
        return con.invoke('AddGroup', 'Beer', 'Carlitos Moreno');
      })
      .then(() => console.log('Join Group suceffully'))
      .catch(error => console.log(error));

    con.on('sendMessage', (message: string) => {
      setNewNotification(msg => [...msg, message]);
    });
    con.on('messageGroup', (message: string) => {
      setNewNotification(msg => [...msg, message]);
    });

    // con
    //   .invoke('AddGroup', 'Beer', 'Carlitos Moreno')
    //   .then(() => console.log('Join group'))
    //   .catch(error => console.log(error));

    setConnectionSignal(con);
  }, []);

  console.log(newNotification);

  return (
    <>
      <h1>Notification</h1>
      {newNotification.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
    </>
  );
}

export default App;
