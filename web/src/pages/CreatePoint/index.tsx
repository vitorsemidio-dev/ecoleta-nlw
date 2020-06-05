import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

import api from '../../services/api';

import './CreatePoint.css';

import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cityNames, setCityNames] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    api.get('/items').then(({ data }) => {
      setItems(data);
    })
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(({ data }) => {
        const ufInitials = data.map(uf => uf.sigla);

        setUfs(ufInitials);
      })
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    };
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
      .then(({ data }) => {
        const cityNames = data.map(city => city.nome);

        setCityNames(cityNames);
      });
  }, [selectedUf]);

  function handleSeletedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSeletedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  return (
    <>
      <div id="page-create-point">
        <header>
          <img src={logo} alt="Ecoleta"/>

          <Link to="/">
            <FiArrowLeft /> Voltar para home
          </Link>
        </header>

        <form>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>
            <div className="field">
              <label htmlFor="name">Nome da Entidade</label>
              <input
                id="name"
                name="name"
                type="text"
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
              <div className="field">
                <label htmlFor="whastapp">WhatsApp</label>
                <input
                  id="whastapp"
                  name="whastapp"
                  type="text"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={[ -22.8814484, -43.4864973 ]} zoom={15}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[ -22.8814484, -43.4864973 ]} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select 
                  value={selectedUf}
                  onChange={handleSeletedUf}
                  name="uf"
                  id="uf">
                  <option value="0">Selecione uma UF</option>
                  {ufs.map(uf => (
                    <option key={uf} value={uf}>
                      { uf }
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select 
                  value={selectedCity}
                  onChange={handleSeletedCity}
                  name="city"
                  id="city">
                  <option value="0">Selecione uma cidade</option>
                  {cityNames.map(city => (
                    <option key={city} value={city}>
                      { city }
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map(({ id, image_url, title}) => (
                <li key={id}>
                  <img src={image_url} alt={title}/>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">
            Cadastrar ponto de coleta
          </button>
        </form>
      </div>
    </>
  )
}

export default CreatePoint;
