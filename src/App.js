import { useState } from 'react';

import data from './database.json';

const sendRequest = (end) => window.fetch(`http://127.0.0.1:5000/${end}`);
const formatDays = (value) => {
  if (value % 1 !== 0) return 'dne';

  if (value === 1) return 'den';

  if (value >= 5) return 'dní';

  return 'dny';
};

const Button = (props) => (
  <button
    {...props}
    className={
      'rounded border border-gray-300 mx-3 my-1 p-2 ' +
      'shadow-sm hover:shadow-md active:shadow-inner text-center ' +
      props.className
    }
  >
    {props.children}
  </button>
);

const Info = () => (
  <div className='flex flex-col p-3 pt-10 justify-center'>
    <div className='flex flex-col p-6 justify-center items-center w-full'>
      <div className='w-full flex justify-between'>
        <span>Vlhkost:</span> <span>80%</span>
      </div>
      <div className='w-full flex justify-between'>
        <span>Zásobník vody:</span>
        <span>Plný</span>
      </div>
    </div>

    {[
      ['Water the plant', 'water'],
      ['Spray mist', 'mist'],
      ['Toggle LED', 'led'],
      ['Toggle UV LED', 'uv']
    ].map(([text, endpoint], i) => (
      <Button key={endpoint} onClick={() => sendRequest(endpoint)}>
        {text}
      </Button>
    ))}
  </div>
);

const NumberWithUnitInput = ({ id, label, unit, defaultValue, onChange }) => (
  <div className='flex w-56 justify-between items-center mt-1'>
    <label htmlFor={id}>{label}: </label>
    <span className='w-28'>
      <input
        id={id}
        type='number'
        defaultValue={defaultValue}
        className='w-16 mx-2 px-1 text-center bg-gray-100 rounded border bg-transparent transition'
        onChange={(e) => onChange([id, e.target.value])}
      />
      <span>{unit}</span>
    </span>
  </div>
);

const Interval = ({ id, value, onChange }) => (
  <NumberWithUnitInput
    id={`${id}Interval`}
    label='Interval'
    unit={formatDays(value)}
    defaultValue={value}
    onChange={onChange}
  />
);

const Amount = ({ id, value, onChange }) => (
  <NumberWithUnitInput
    id={`${id}Amount`}
    label='Množství'
    unit='ml'
    defaultValue={value}
    onChange={onChange}
  />
);

const Toggle = ({ id, name, value, onChange }) => (
  <div className='flex w-56 justify-between items-center mt-1'>
    <label htmlFor={id}>{name}: </label>
    <div className='form-check form-switch'>
      <input
        className='form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm'
        type='checkbox'
        role='switch'
        id='flexSwitchCheckDefault56'
        defaultChecked={value}
        onChange={(e) => onChange([id, e.target.checked])}
      />
    </div>
  </div>
);

const SettingsItem = ({ title, children }) => (
  <div className='mb-4 w-64 py-3 flex justify-center shadow-lg items-center flex-col bg-gray-200 rounded'>
    <h1 className='text-xl font-semibold mb-1.5'>{title}</h1>
    {children}
  </div>
);

const Settings = ({
  state: {
    waterInterval,
    waterAmount,
    mistInterval,
    whiteDay,
    whiteNight,
    uvDay,
    uvNight,
    bowl
  },
  onSettingsChange: onChange
}) => (
  <div className='flex w-full flex-col items-center pt-4 pb-10'>
    <SettingsItem title='Voda'>
      <Interval id='water' value={waterInterval} onChange={onChange} />
      <Amount id='water' value={waterAmount} onChange={onChange} />
    </SettingsItem>

    <SettingsItem title='Rosení'>
      <Interval id='mist' value={mistInterval} onChange={onChange} />
    </SettingsItem>

    <SettingsItem title='Bílá LED'>
      <Toggle
        id='whiteDay'
        name='Ve dne'
        value={whiteDay}
        onChange={onChange}
      />
      <Toggle
        id='whiteNight'
        name='V noci'
        value={whiteNight}
        onChange={onChange}
      />
    </SettingsItem>

    <SettingsItem title='UV LED'>
      <Toggle id='uvDay' name='Ve dne' value={uvDay} onChange={onChange} />
      <Toggle id='uvNight' name='V noci' value={uvNight} onChange={onChange} />
    </SettingsItem>

    <SettingsItem title='Ostatní'>
      <Toggle id='bowl' name='Podmiska' value={bowl} onChange={onChange} />
    </SettingsItem>

    <Button className='w-36 mt-4'>Nastavit</Button>
  </div>
);

const PostItem = (name, value, unit) => (
  <>
    {value || (typeof value === 'boolean' && value)
      ? (
      <div className='flex justify-between w-full text-right mr-5'>
        <span className='font-md'>{name}: </span>
        <span className='w-16'>
          <span className='inline-block'>
            {typeof value !== 'boolean' ? value : value ? 'Ano' : 'Ne'}
          </span>
          {unit ? <span className='inline-block w-9'>{unit}</span> : null}
        </span>
      </div>
        )
      : null}
  </>
);

const Post = ({ name, data, onSelect }) => {
  const {
    water: [waterInterval, waterAmount],
    mist,
    white: [whiteDay, whiteNight],
    uv: [uvDay, uvNight],
    bowl
  } = data;
  return (
    <div
      className='border border-gray-300 shadow-md rounded w-64 my-2'
      onClick={() => onSelect(data)}
    >
      <span className='block font-bold text-lg mx-2 p-1 text-center w-full'>
        {name}
      </span>
      <div className='p-5 pt-1'>
        {PostItem(
          'Interval zalévání',
          waterInterval,
          formatDays(waterInterval),
          onSelect
        )}
        {PostItem('Množství vody', waterAmount, 'ml', onSelect)}
        {PostItem('Interval rosení', mist, formatDays(mist), onSelect)}
        {PostItem('Bílá LED ve dne', whiteDay, null, onSelect)}
        {PostItem('Bílá LED v noci', whiteNight, null, onSelect)}
        {PostItem('UV LED ve dne', uvDay, null, onSelect)}
        {PostItem('UV LED v noci', uvNight, null, onSelect)}
        {PostItem('Podmiska', bowl, null, onSelect)}
      </div>
    </div>
  );
};

const Database = ({ onPlantSelection }) => (
  <div className='flex justify-center items-center flex-col'>
    {data.plants.map((plant) => (
      <Post
        key={plant.name}
        name={plant.name}
        data={plant}
        onSelect={onPlantSelection}
      />
    ))}
  </div>
);

const App = () => {
  const [selectedScreen, setSelectedScreen] = useState(0);

  const [state, setState] = useState({
    waterInterval: 1,
    waterAmount: 10,
    mistInterval: 1,
    whiteDay: true,
    whiteNight: true,
    uvDay: true,
    uvNight: true,
    bowl: true
  });

  const settingsChange = ([key, value]) => {
    const newState = state;
    newState[key] = value;
    console.log(key, value);
    setState(newState);
  };

  const selectPlant = (plant) => {
    console.log(plant);

    const {
      water: [waterInterval, waterAmount],
      mist,
      white: [whiteDay, whiteNight],
      uv: [uvDay, uvNight],
      bowl
    } = plant;

    setState({
      waterInterval,
      waterAmount,
      mistInterval: mist,
      whiteDay,
      whiteNight,
      uvDay,
      uvNight,
      bowl
    });
  };

  const Screen = [
    <Info key='info' />,
    <Settings
      key='settings'
      state={state}
      onSettingsChange={(data) => settingsChange(data)}
    ></Settings>,
    <Database key='database' onPlantSelection={(plant) => selectPlant(plant)} />
  ][selectedScreen];

  const screens = ['Info', 'Nastavení', 'Databáze'];

  return (
    <div className='bg-gray-100 pt-14 h-screen container select-none'>
      <div className='fixed top-0 h-14 bg-green-800 w-full flex items-center justify-center'>
        <span className='text-left text-3xl font-medium text-gray-200'>Rooty</span>
      </div>
      <div className='overflow-y-auto h-[calc(100vh-6.5rem)]'>{Screen}</div>
      <div
        className={
          'fixed bottom-0 w-full h-12 border-t border-gray-300 ' +
          'flex items-center justify-center bg-gray-100 z-10 ' +
          'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]'
        }
      >
        {screens.map((screen, i) => (
          <div
            key={i}
            className={
              'text-center flex-1 border-gray-800 ' +
              'flex items-center justify-center'
            }
            onClick={() => setSelectedScreen(i)}
          >
            <Button className='p-2 rounded-full border-0 shadow-none hover:shadow-none'>
              {screen}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
