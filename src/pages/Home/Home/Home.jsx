import React from 'react';
import Hero from '../Hero/Hero';
import TopWorker from '../TopWorker/TopWorker';
import Testomonial from '../Testomonial/Testomonial';
import ExtraSection from '../ExtraSection/ExtraSection';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <TopWorker></TopWorker>
            <Testomonial></Testomonial>
            <ExtraSection></ExtraSection>
        </div>
    );
};

export default Home;