(() => {
  const phrases = [
    // Core rescue language
    { id: 'dobar-dan', local: 'Dobar dan.', english: 'Good day / Hello.', pronunciation: 'DOH-bar dahn', country: 'shared', category: 'Basics' },
    { id: 'dobro-jutro', local: 'Dobro jutro.', english: 'Good morning.', pronunciation: 'DOH-broh YOO-troh', country: 'shared', category: 'Basics' },
    { id: 'dobra-vecer', local: 'Dobra večer.', english: 'Good evening.', pronunciation: 'DOH-brah VEH-cher', country: 'croatia', category: 'Basics', note: 'The usual Croatian form.' },
    { id: 'dobro-vece', local: 'Dobro veče.', english: 'Good evening.', pronunciation: 'DOH-broh VEH-cheh', country: 'montenegro', category: 'Basics', note: 'A common Montenegrin form.' },
    { id: 'hvala', local: 'Hvala.', english: 'Thank you.', pronunciation: 'HVAH-lah', country: 'shared', category: 'Basics' },
    { id: 'molim', local: 'Molim.', english: 'Please / You’re welcome.', pronunciation: 'MOH-leem', country: 'shared', category: 'Basics' },
    { id: 'oprostite', local: 'Oprostite.', english: 'Excuse me / Sorry.', pronunciation: 'oh-PROH-stee-teh', country: 'croatia', category: 'Basics' },
    { id: 'izvinite', local: 'Izvinite.', english: 'Excuse me / Sorry.', pronunciation: 'ee-ZVEE-nee-teh', country: 'montenegro', category: 'Basics' },
    { id: 'ne-razumijem', local: 'Ne razumijem.', english: 'I don’t understand.', pronunciation: 'neh rah-ZOO-mee-yem', country: 'shared', category: 'Rescue' },
    { id: 'ponoviti', local: 'Možete li ponoviti?', english: 'Can you repeat that?', pronunciation: 'MOH-zheh-teh lee poh-NOH-vee-tee', country: 'shared', category: 'Rescue' },
    { id: 'sporije', local: 'Sporije, molim.', english: 'More slowly, please.', pronunciation: 'SPOH-ree-yeh, MOH-leem', country: 'shared', category: 'Rescue' },
    { id: 'engleski', local: 'Govorite li engleski?', english: 'Do you speak English?', pronunciation: 'goh-VOH-ree-teh lee EN-gleh-skee', country: 'shared', category: 'Rescue' },
    { id: 'malo-hrvatski', local: 'Govorim samo malo hrvatski.', english: 'I speak only a little Croatian.', pronunciation: 'goh-VOH-reem SAH-moh MAH-loh HR-vat-skee', country: 'croatia', category: 'Rescue' },
    { id: 'malo-crnogorski', local: 'Govorim samo malo crnogorski.', english: 'I speak only a little Montenegrin.', pronunciation: 'goh-VOH-reem SAH-moh MAH-loh tsr-noh-GOR-skee', country: 'montenegro', category: 'Rescue' },
    { id: 'pokazati', local: 'Možete li mi pokazati?', english: 'Can you show me?', pronunciation: 'MOH-zheh-teh lee mee poh-KAH-zah-tee', country: 'shared', category: 'Rescue' },
    { id: 'znaci', local: 'Što to znači?', english: 'What does that mean?', pronunciation: 'shtoh toh ZNAH-chee', country: 'croatia', category: 'Rescue' },
    { id: 'znaci-mne', local: 'Šta to znači?', english: 'What does that mean?', pronunciation: 'shtah toh ZNAH-chee', country: 'montenegro', category: 'Rescue' },

    // Introductions and courtesy
    { id: 'zovem-se', local: 'Zovem se {name}.', english: 'My name is {name}.', pronunciation: 'ZOH-vem seh {name}', country: 'shared', category: 'Social' },
    { id: 'iz-ohija', local: 'Ja sam iz Ohija.', english: 'I’m from Ohio.', pronunciation: 'yah sahm eez oh-HEE-yah', country: 'shared', category: 'Social' },
    { id: 'na-odmoru', local: 'Na odmoru smo.', english: 'We’re on vacation.', pronunciation: 'nah ODM-oh-roo smoh', country: 'shared', category: 'Social' },
    { id: 'drago-mi-je', local: 'Drago mi je.', english: 'Nice to meet you.', pronunciation: 'DRAH-goh mee yeh', country: 'shared', category: 'Social' },
    { id: 'kako-ste', local: 'Kako ste?', english: 'How are you?', pronunciation: 'KAH-koh steh', country: 'shared', category: 'Social' },
    { id: 'dobro-sam', local: 'Dobro sam, hvala.', english: 'I’m well, thank you.', pronunciation: 'DOH-broh sahm, HVAH-lah', country: 'shared', category: 'Social' },
    { id: 'svida-se', local: 'Sviđa nam se ovdje.', english: 'We like it here.', pronunciation: 'SVEE-jah nahm seh OV-dyeh', country: 'shared', category: 'Social' },
    { id: 'volimo', local: 'Volimo planinarenje i šetnje uz more.', english: 'We like hiking and walks by the sea.', pronunciation: 'VOH-lee-moh plah-nee-NAH-reh-nyeh ee SHET-nyeh ooz MOH-reh', country: 'shared', category: 'Social' },
    { id: 'preporuciti', local: 'Možete li nešto preporučiti?', english: 'Can you recommend something?', pronunciation: 'MOH-zheh-teh lee NEH-shtoh preh-poh-ROO-chee-tee', country: 'shared', category: 'Social' },

    // Numbers, time, prices
    { id: 'brojevi-1-5', local: 'jedan · dva · tri · četiri · pet', english: 'one · two · three · four · five', pronunciation: 'YEH-dahn · dvah · tree · CHEH-tee-ree · pet', country: 'shared', category: 'Numbers' },
    { id: 'brojevi-6-10', local: 'šest · sedam · osam · devet · deset', english: 'six · seven · eight · nine · ten', pronunciation: 'shest · SEH-dahm · OH-sahm · DEH-vet · DEH-set', country: 'shared', category: 'Numbers' },
    { id: 'koliko-kosta', local: 'Koliko košta?', english: 'How much does it cost?', pronunciation: 'KOH-lee-koh KOH-shtah', country: 'shared', category: 'Money' },
    { id: 'dvadeset-eura', local: 'Dvadeset eura.', english: 'Twenty euros.', pronunciation: 'DVAH-deh-set EH-oo-rah', country: 'shared', category: 'Money' },
    { id: 'karticom', local: 'Mogu li platiti karticom?', english: 'Can I pay by card?', pronunciation: 'MOH-goo lee PLAH-tee-tee KAR-tee-tsom', country: 'shared', category: 'Money' },
    { id: 'gotovinom', local: 'Samo gotovinom.', english: 'Cash only.', pronunciation: 'SAH-moh goh-toh-VEE-nohm', country: 'shared', category: 'Money', note: 'Useful to recognize in replies and on signs.' },
    { id: 'u-koliko-sati', local: 'U koliko sati?', english: 'At what time?', pronunciation: 'oo KOH-lee-koh SAH-tee', country: 'shared', category: 'Time' },
    { id: 'u-deset', local: 'U deset sati.', english: 'At ten o’clock.', pronunciation: 'oo DEH-set SAH-tee', country: 'shared', category: 'Time' },
    { id: 'danas', local: 'danas · sutra · jučer', english: 'today · tomorrow · yesterday', pronunciation: 'DAH-nahs · SOO-trah · YOO-cher', country: 'croatia', category: 'Time' },
    { id: 'danas-mne', local: 'danas · sjutra · juče', english: 'today · tomorrow · yesterday', pronunciation: 'DAH-nahs · SYOO-trah · YOO-cheh', country: 'montenegro', category: 'Time', note: '“Sutra” is also widely understood and used.' },
    { id: 'koliko-dugo', local: 'Koliko dugo traje?', english: 'How long does it take?', pronunciation: 'KOH-lee-koh DOO-goh TRAH-yeh', country: 'shared', category: 'Time' },

    // Food and drink
    { id: 'jednu-kavu', local: 'Jednu kavu, molim.', english: 'One coffee, please.', pronunciation: 'YEH-dnoo KAH-voo, MOH-leem', country: 'croatia', category: 'Food' },
    { id: 'jednu-kafu', local: 'Jednu kafu, molim.', english: 'One coffee, please.', pronunciation: 'YEH-dnoo KAH-foo, MOH-leem', country: 'montenegro', category: 'Food' },
    { id: 'dva-piva', local: 'Dva piva, molim.', english: 'Two beers, please.', pronunciation: 'dvah PEE-vah, MOH-leem', country: 'shared', category: 'Food' },
    { id: 'negazirana', local: 'Negaziranu vodu, molim.', english: 'Still water, please.', pronunciation: 'neh-gah-ZEE-rah-noo VOH-doo, MOH-leem', country: 'shared', category: 'Food' },
    { id: 'gazirana', local: 'Gaziranu vodu, molim.', english: 'Sparkling water, please.', pronunciation: 'gah-ZEE-rah-noo VOH-doo, MOH-leem', country: 'shared', category: 'Food' },
    { id: 'bez-leda', local: 'Bez leda, molim.', english: 'No ice, please.', pronunciation: 'bez LEH-dah, MOH-leem', country: 'shared', category: 'Food' },
    { id: 'jelovnik', local: 'Možemo li dobiti jelovnik?', english: 'Can we have the menu?', pronunciation: 'MOH-zheh-moh lee DOH-bee-tee YEH-lohv-neek', country: 'croatia', category: 'Food' },
    { id: 'meni', local: 'Možemo li dobiti meni?', english: 'Can we have the menu?', pronunciation: 'MOH-zheh-moh lee DOH-bee-tee MEH-nee', country: 'montenegro', category: 'Food' },
    { id: 'sto-slobodan', local: 'Je li ovaj stol slobodan?', english: 'Is this table free?', pronunciation: 'yeh lee OH-vai stohl SLOH-boh-dahn', country: 'croatia', category: 'Food' },
    { id: 'sto-slobodan-mne', local: 'Da li je ovaj sto slobodan?', english: 'Is this table free?', pronunciation: 'dah lee yeh OH-vai stoh SLOH-boh-dahn', country: 'montenegro', category: 'Food' },
    { id: 'sjesti-vani', local: 'Možemo li sjesti vani?', english: 'Can we sit outside?', pronunciation: 'MOH-zheh-moh lee SYEH-stee VAH-nee', country: 'croatia', category: 'Food' },
    { id: 'sjesti-napolju', local: 'Možemo li sjesti napolju?', english: 'Can we sit outside?', pronunciation: 'MOH-zheh-moh lee SYEH-stee nah-POH-lyoo', country: 'montenegro', category: 'Food' },
    { id: 'naruciti', local: 'Htio bih naručiti.', english: 'I’d like to order.', pronunciation: 'HTEE-oh beeh nah-ROO-chee-tee', country: 'shared', category: 'Food', note: 'This form matches a male speaker.' },
    { id: 'lokalno', local: 'Što preporučujete od lokalnih jela?', english: 'What local dish do you recommend?', pronunciation: 'shtoh preh-poh-ROO-choo-yeh-teh od loh-KAHL-neeh YEH-lah', country: 'croatia', category: 'Food' },
    { id: 'lokalno-mne', local: 'Šta preporučujete od lokalnih jela?', english: 'What local dish do you recommend?', pronunciation: 'shtah preh-poh-ROO-choo-yeh-teh od loh-KAHL-neeh YEH-lah', country: 'montenegro', category: 'Food' },
    { id: 'racun', local: 'Račun, molim.', english: 'The bill, please.', pronunciation: 'RAH-choon, MOH-leem', country: 'shared', category: 'Money' },
    { id: 'ukusno', local: 'Bilo je vrlo ukusno.', english: 'It was very good.', pronunciation: 'BEE-loh yeh VR-loh OO-koos-noh', country: 'shared', category: 'Food' },

    // Hotel and directions
    { id: 'rezervacija', local: 'Imamo rezervaciju na ime {name}.', english: 'We have a reservation under {name}.', pronunciation: 'EE-mah-moh reh-zehr-VAH-tsee-yoo nah EE-meh {name}', country: 'shared', category: 'Hotel' },
    { id: 'dvije-noci', local: 'Ostajemo dvije noći.', english: 'We’re staying two nights.', pronunciation: 'oh-STAH-yeh-moh DVEE-yeh NOH-chee', country: 'shared', category: 'Hotel' },
    { id: 'dorucak-hr', local: 'Je li doručak uključen?', english: 'Is breakfast included?', pronunciation: 'yeh lee DOH-roo-chak oo-KLYOO-chen', country: 'croatia', category: 'Hotel' },
    { id: 'dorucak-mne', local: 'Da li je doručak uključen?', english: 'Is breakfast included?', pronunciation: 'dah lee yeh DOH-roo-chak oo-KLYOO-chen', country: 'montenegro', category: 'Hotel' },
    { id: 'wifi', local: 'Koja je lozinka za Wi-Fi?', english: 'What is the Wi-Fi password?', pronunciation: 'KOH-yah yeh LOH-zeen-kah zah WAI-fai', country: 'shared', category: 'Hotel' },
    { id: 'checkout', local: 'U koliko sati je odjava?', english: 'What time is checkout?', pronunciation: 'oo KOH-lee-koh SAH-tee yeh OD-yah-vah', country: 'shared', category: 'Hotel' },
    { id: 'pogled-more', local: 'Možemo li dobiti sobu s pogledom na more?', english: 'Can we have a room with a sea view?', pronunciation: 'MOH-zheh-moh lee DOH-bee-tee SOH-boo s POH-gleh-dohm nah MOH-reh', country: 'shared', category: 'Hotel' },
    { id: 'gdje-je', local: 'Gdje je…?', english: 'Where is…?', pronunciation: 'gdyeh yeh', country: 'shared', category: 'Directions' },
    { id: 'na-karti', local: 'Možete li mi pokazati na karti?', english: 'Can you show me on the map?', pronunciation: 'MOH-zheh-teh lee mee poh-KAH-zah-tee nah KAR-tee', country: 'shared', category: 'Directions' },
    { id: 'ravno', local: 'Idite ravno.', english: 'Go straight.', pronunciation: 'EE-dee-teh RAHV-noh', country: 'shared', category: 'Directions' },
    { id: 'lijevo', local: 'Skrenite lijevo.', english: 'Turn left.', pronunciation: 'SKREH-nee-teh LEE-yeh-voh', country: 'shared', category: 'Directions' },
    { id: 'desno', local: 'Skrenite desno.', english: 'Turn right.', pronunciation: 'SKREH-nee-teh DEHS-noh', country: 'shared', category: 'Directions' },
    { id: 'koliko-daleko', local: 'Koliko je daleko?', english: 'How far is it?', pronunciation: 'KOH-lee-koh yeh DAH-leh-koh', country: 'shared', category: 'Directions' },
    { id: 'pjesice', local: 'Možemo li tamo pješice?', english: 'Can we walk there?', pronunciation: 'MOH-zheh-moh lee TAH-moh PYEH-shee-tseh', country: 'shared', category: 'Directions' },

    // Car rental, road and border
    { id: 'rezervacija-auto', local: 'Imam rezervaciju za automobil.', english: 'I have a car reservation.', pronunciation: 'EE-mahm reh-zehr-VAH-tsee-yoo zah ow-toh-MOH-beel', country: 'croatia', category: 'Driving' },
    { id: 'rezervacija-auto-mne', local: 'Imam rezervaciju za auto.', english: 'I have a car reservation.', pronunciation: 'EE-mahm reh-zehr-VAH-tsee-yoo zah OW-toh', country: 'montenegro', category: 'Driving' },
    { id: 'osiguranje-hr', local: 'Je li osiguranje važeće u Crnoj Gori?', english: 'Is the insurance valid in Montenegro?', pronunciation: 'yeh lee oh-see-goo-RAH-nyeh VAH-zheh-cheh oo TSR-noi GOH-ree', country: 'croatia', category: 'Driving' },
    { id: 'osiguranje-mne', local: 'Da li osiguranje važi u Hrvatskoj?', english: 'Is the insurance valid in Croatia?', pronunciation: 'dah lee oh-see-goo-RAH-nyeh VAH-zhee oo HR-vat-skoi', country: 'montenegro', category: 'Driving' },
    { id: 'dokumenti-auto', local: 'Koje dokumente trebam za automobil?', english: 'Which documents do I need for the car?', pronunciation: 'KOH-yeh doh-koo-MEN-teh TREH-bahm zah ow-toh-MOH-beel', country: 'croatia', category: 'Driving' },
    { id: 'dokumenti-auto-mne', local: 'Koja dokumenta su mi potrebna za auto?', english: 'Which documents do I need for the car?', pronunciation: 'KOH-yah doh-koo-MEN-tah soo mee poh-TREHB-nah zah OW-toh', country: 'montenegro', category: 'Driving' },
    { id: 'benzin-dizel', local: 'Je li ovo benzin ili dizel?', english: 'Is this gasoline or diesel?', pronunciation: 'yeh lee OH-voh BEN-zeen EE-lee DEE-zehl', country: 'shared', category: 'Driving' },
    { id: 'vratiti-auto', local: 'Gdje vraćam automobil?', english: 'Where do I return the car?', pronunciation: 'gdyeh VRAH-chahm ow-toh-MOH-beel', country: 'croatia', category: 'Driving' },
    { id: 'vratiti-auto-mne', local: 'Gdje vraćam auto?', english: 'Where do I return the car?', pronunciation: 'gdyeh VRAH-chahm OW-toh', country: 'montenegro', category: 'Driving' },
    { id: 'parking-hr', local: 'Gdje je parkiralište?', english: 'Where is the parking lot?', pronunciation: 'gdyeh yeh par-kee-RAH-lee-shteh', country: 'croatia', category: 'Parking' },
    { id: 'parking-mne', local: 'Gdje je parking?', english: 'Where is the parking?', pronunciation: 'gdyeh yeh PAR-king', country: 'montenegro', category: 'Parking' },
    { id: 'parkirati-hr', local: 'Smijem li ovdje parkirati?', english: 'Can I park here?', pronunciation: 'SMEE-yem lee OV-dyeh par-kee-RAH-tee', country: 'croatia', category: 'Parking' },
    { id: 'parkirati-mne', local: 'Mogu li ovdje parkirati?', english: 'Can I park here?', pronunciation: 'MOH-goo lee OV-dyeh par-kee-RAH-tee', country: 'montenegro', category: 'Parking' },
    { id: 'parking-cijena', local: 'Koliko košta parking?', english: 'How much is parking?', pronunciation: 'KOH-lee-koh KOH-shtah PAR-king', country: 'shared', category: 'Parking' },
    { id: 'benzinska-hr', local: 'Gdje je najbliža benzinska postaja?', english: 'Where is the nearest gas station?', pronunciation: 'gdyeh yeh nai-BLEE-zhah BEN-zeen-skah poh-STAH-yah', country: 'croatia', category: 'Driving' },
    { id: 'benzinska-mne', local: 'Gdje je najbliža benzinska pumpa?', english: 'Where is the nearest gas station?', pronunciation: 'gdyeh yeh nai-BLEE-zhah BEN-zeen-skah POOM-pah', country: 'montenegro', category: 'Driving' },
    { id: 'do-vrha', local: 'Do vrha, molim.', english: 'Fill it up, please.', pronunciation: 'doh VR-hah, MOH-leem', country: 'shared', category: 'Driving' },
    { id: 'putovnice', local: 'Evo naših putovnica.', english: 'Here are our passports.', pronunciation: 'EH-voh NAH-sheeh poo-TOHV-nee-tsah', country: 'croatia', category: 'Border' },
    { id: 'pasosi', local: 'Evo naših pasoša.', english: 'Here are our passports.', pronunciation: 'EH-voh NAH-sheeh PAH-soh-shah', country: 'montenegro', category: 'Border' },
    { id: 'perast-tri', local: 'Idemo u Perast na tri noći.', english: 'We’re going to Perast for three nights.', pronunciation: 'EE-deh-moh oo PEH-rahst nah tree NOH-chee', country: 'montenegro', category: 'Border' },
    { id: 'rentani-auto', local: 'Ovo je iznajmljeni automobil.', english: 'This is a rental car.', pronunciation: 'OH-voh yeh eez-nai-MLYEH-nee ow-toh-MOH-beel', country: 'shared', category: 'Border' },
    { id: 'povratak-hr', local: 'Vraćamo se u Hrvatsku u petak.', english: 'We’re returning to Croatia on Friday.', pronunciation: 'VRAH-chah-moh seh oo HR-vat-skoo oo PEH-tahk', country: 'shared', category: 'Border' },

    // Perast and boats
    { id: 'parking-hotel', local: 'Gdje možemo parkirati kod hotela?', english: 'Where can we park near the hotel?', pronunciation: 'gdyeh MOH-zheh-moh par-kee-RAH-tee kod hoh-TEH-lah', country: 'montenegro', category: 'Parking' },
    { id: 'brod-gospa', local: 'Odakle polazi brod za Gospu od Škrpjela?', english: 'Where does the boat to Our Lady of the Rocks leave from?', pronunciation: 'oh-DAH-kleh POH-lah-zee brohd zah GOH-spoo od SHKRP-yeh-lah', country: 'montenegro', category: 'Boat' },
    { id: 'brod-kada', local: 'Kada polazi sljedeći brod?', english: 'When does the next boat leave?', pronunciation: 'KAH-dah POH-lah-zee SLYEH-deh-chee brohd', country: 'shared', category: 'Boat' },
    { id: 'brod-povratak', local: 'Kada se vraća?', english: 'When does it return?', pronunciation: 'KAH-dah seh VRAH-chah', country: 'shared', category: 'Boat' },
    { id: 'dvije-povratne', local: 'Dvije povratne karte, molim.', english: 'Two return tickets, please.', pronunciation: 'DVEE-yeh poh-VRAHT-neh KAR-teh, MOH-leem', country: 'shared', category: 'Boat' },
    { id: 'uz-more', local: 'Možemo li sjesti uz more?', english: 'Can we sit by the sea?', pronunciation: 'MOH-zheh-moh lee SYEH-stee ooz MOH-reh', country: 'shared', category: 'Food' },
    { id: 'zadnji-brod', local: 'Kada je posljednji brod?', english: 'When is the last boat?', pronunciation: 'KAH-dah yeh POH-slyehd-nyee brohd', country: 'shared', category: 'Boat' },

    // Žabljak, road conditions and hiking
    { id: 'put-otvoren', local: 'Da li je put otvoren?', english: 'Is the road open?', pronunciation: 'dah lee yeh poot OHT-voh-ren', country: 'montenegro', category: 'Driving' },
    { id: 'uslovi-put', local: 'Kakvi su uslovi na putu?', english: 'What are the road conditions?', pronunciation: 'KAH-kvee soo oo-SLOH-vee nah POO-too', country: 'montenegro', category: 'Driving' },
    { id: 'staza-otvorena', local: 'Da li je staza otvorena?', english: 'Is the trail open?', pronunciation: 'dah lee yeh STAH-zah OHT-voh-reh-nah', country: 'montenegro', category: 'Hiking' },
    { id: 'pocetak-staze', local: 'Gdje počinje staza?', english: 'Where does the trail start?', pronunciation: 'gdyeh POH-chee-nyeh STAH-zah', country: 'shared', category: 'Hiking' },
    { id: 'crno-jezero', local: 'Koliko traje šetnja oko Crnog jezera?', english: 'How long is the walk around Black Lake?', pronunciation: 'KOH-lee-koh TRAH-yeh SHET-nyah OH-koh TSR-nohg YEH-zeh-rah', country: 'montenegro', category: 'Hiking' },
    { id: 'vrijeme-planina', local: 'Kakvo će biti vrijeme u planini?', english: 'What will the weather be like in the mountains?', pronunciation: 'KAH-kvoh cheh BEE-tee VREE-yeh-meh oo plah-NEE-nee', country: 'shared', category: 'Hiking' },
    { id: 'jakna', local: 'Treba li nam jakna?', english: 'Do we need a jacket?', pronunciation: 'TREH-bah lee nahm YAHK-nah', country: 'shared', category: 'Hiking' },
    { id: 'staza-klizava', local: 'Je li staza klizava?', english: 'Is the trail slippery?', pronunciation: 'yeh lee STAH-zah KLEE-zah-vah', country: 'shared', category: 'Hiking' },
    { id: 'teska-staza', local: 'Je li staza teška?', english: 'Is the trail difficult?', pronunciation: 'yeh lee STAH-zah TESH-kah', country: 'shared', category: 'Hiking' },
    { id: 'pogled', local: 'Gdje je najbolji pogled?', english: 'Where is the best view?', pronunciation: 'gdyeh yeh nai-BOH-lyee POH-gled', country: 'shared', category: 'Hiking' },

    // Ferry and Korčula
    { id: 'trajekt-korcula', local: 'Odakle polazi trajekt za Korčulu?', english: 'Where does the ferry to Korčula leave from?', pronunciation: 'oh-DAH-kleh POH-lah-zee TRAH-yekt zah KOR-choo-loo', country: 'croatia', category: 'Ferry' },
    { id: 'zadnji-trajekt', local: 'Kada je posljednji trajekt?', english: 'When is the last ferry?', pronunciation: 'KAH-dah yeh POH-slyehd-nyee TRAH-yekt', country: 'croatia', category: 'Ferry' },
    { id: 'karte-trajekt', local: 'Gdje možemo kupiti karte?', english: 'Where can we buy tickets?', pronunciation: 'gdyeh MOH-zheh-moh KOO-pee-tee KAR-teh', country: 'shared', category: 'Ferry' },
    { id: 'red-ukrcaj', local: 'Je li ovo red za ukrcaj?', english: 'Is this the line for boarding?', pronunciation: 'yeh lee OH-voh red zah oo-KR-tsai', country: 'croatia', category: 'Ferry' },
    { id: 'auto-trajekt', local: 'Imamo automobil.', english: 'We have a car.', pronunciation: 'EE-mah-moh ow-toh-MOH-beel', country: 'croatia', category: 'Ferry' },
    { id: 'koliko-ranije', local: 'Koliko ranije trebamo doći?', english: 'How early should we arrive?', pronunciation: 'KOH-lee-koh RAH-nee-yeh TREH-bah-moh DOH-chee', country: 'croatia', category: 'Ferry' },
    { id: 'pjesice-stari-grad', local: 'Koliko je do Starog grada pješice?', english: 'How far is the Old Town on foot?', pronunciation: 'KOH-lee-koh yeh doh STAH-rohg GRAH-dah PYEH-shee-tseh', country: 'croatia', category: 'Directions' },
    { id: 'mirna-plaza', local: 'Možete li preporučiti mirnu plažu?', english: 'Can you recommend a quiet beach?', pronunciation: 'MOH-zheh-teh lee preh-poh-ROO-chee-tee MEER-noo PLAH-zhoo', country: 'croatia', category: 'Social' },
    { id: 'autobus-stanica', local: 'Gdje je autobusna stanica?', english: 'Where is the bus station?', pronunciation: 'gdyeh yeh OW-toh-boos-nah STAH-nee-tsah', country: 'shared', category: 'Transport' },
    { id: 'izlet-brodom', local: 'Ima li danas izlet brodom?', english: 'Is there a boat excursion today?', pronunciation: 'EE-mah lee DAH-nahs EEZ-let BROH-dohm', country: 'croatia', category: 'Boat' },
    { id: 'povratak-izlet', local: 'U koliko sati se vraćamo?', english: 'What time do we return?', pronunciation: 'oo KOH-lee-koh SAH-tee seh VRAH-chah-moh', country: 'shared', category: 'Boat' },

    // Dubrovnik and airport
    { id: 'bus-stari-grad', local: 'Koji autobus ide do Starog grada?', english: 'Which bus goes to the Old Town?', pronunciation: 'KOH-yee OW-toh-boos EE-deh doh STAH-rohg GRAH-dah', country: 'croatia', category: 'Transport' },
    { id: 'ulaz-zidine', local: 'Gdje je ulaz na zidine?', english: 'Where is the entrance to the walls?', pronunciation: 'gdyeh yeh OO-lahz nah ZEE-dee-neh', country: 'croatia', category: 'Directions' },
    { id: 'najmanja-guzva', local: 'Kada je najmanja gužva?', english: 'When is it least crowded?', pronunciation: 'KAH-dah yeh nai-MAH-nyah GOOZH-vah', country: 'croatia', category: 'Social' },
    { id: 'mirniji-put', local: 'Postoji li mirniji put?', english: 'Is there a quieter route?', pronunciation: 'poh-STOH-yee lee MEER-nee-yee poot', country: 'croatia', category: 'Directions' },
    { id: 'prtljaga', local: 'Gdje mogu ostaviti prtljagu?', english: 'Where can I leave my luggage?', pronunciation: 'gdyeh MOH-goo oh-STAH-vee-tee PRT-lyah-goo', country: 'croatia', category: 'Hotel' },
    { id: 'zracna-luka', local: 'Koliko traje vožnja do zračne luke?', english: 'How long is the ride to the airport?', pronunciation: 'KOH-lee-koh TRAH-yeh VOHZH-nyah doh ZRAHCH-neh LOO-keh', country: 'croatia', category: 'Transport' },
    { id: 'taksi-aerodrom', local: 'Koliko traje vožnja do aerodroma?', english: 'How long is the ride to the airport?', pronunciation: 'KOH-lee-koh TRAH-yeh VOHZH-nyah doh ah-eh-roh-DROH-mah', country: 'montenegro', category: 'Transport' },
    { id: 'taksi', local: 'Možete li pozvati taksi?', english: 'Can you call a taxi?', pronunciation: 'MOH-zheh-teh lee POHZ-vah-tee TAK-see', country: 'shared', category: 'Transport' },

    // Problems, pharmacy, emergencies
    { id: 'pomoc', local: 'Trebam pomoć.', english: 'I need help.', pronunciation: 'TREH-bahm POH-moch', country: 'croatia', category: 'Emergency' },
    { id: 'pomoc-mne', local: 'Treba mi pomoć.', english: 'I need help.', pronunciation: 'TREH-bah mee POH-moch', country: 'montenegro', category: 'Emergency' },
    { id: 'izgubio-telefon', local: 'Izgubio sam telefon.', english: 'I lost my phone.', pronunciation: 'eez-GOO-bee-oh sahm TEH-leh-fohn', country: 'shared', category: 'Problems' },
    { id: 'izgubio-novcanik', local: 'Izgubio sam novčanik.', english: 'I lost my wallet.', pronunciation: 'eez-GOO-bee-oh sahm NOHV-chah-neek', country: 'shared', category: 'Problems' },
    { id: 'ljekarna', local: 'Trebam ljekarnu.', english: 'I need a pharmacy.', pronunciation: 'TREH-bahm LYEH-kar-noo', country: 'croatia', category: 'Health' },
    { id: 'apoteka', local: 'Treba mi apoteka.', english: 'I need a pharmacy.', pronunciation: 'TREH-bah mee ah-POH-teh-kah', country: 'montenegro', category: 'Health' },
    { id: 'koljeno', local: 'Boli me koljeno.', english: 'My knee hurts.', pronunciation: 'BOH-lee meh KOH-lyeh-noh', country: 'croatia', category: 'Health' },
    { id: 'koljeno-mne', local: 'Boli me koljeno.', english: 'My knee hurts.', pronunciation: 'BOH-lee meh KOH-lyeh-noh', country: 'montenegro', category: 'Health' },
    { id: 'protiv-bolova', local: 'Imate li nešto protiv bolova?', english: 'Do you have something for pain?', pronunciation: 'EE-mah-teh lee NEH-shtoh PROH-teev BOH-loh-vah', country: 'shared', category: 'Health' },
    { id: 'lijecnik', local: 'Trebam liječnika.', english: 'I need a doctor.', pronunciation: 'TREH-bahm LEE-yech-nee-kah', country: 'croatia', category: 'Health' },
    { id: 'ljekar', local: 'Treba mi ljekar.', english: 'I need a doctor.', pronunciation: 'TREH-bah mee LYEH-kar', country: 'montenegro', category: 'Health' },
    { id: 'hitna', local: 'Zovite hitnu pomoć.', english: 'Call an ambulance.', pronunciation: 'ZOH-vee-teh HEET-noo POH-moch', country: 'shared', category: 'Emergency' },
    { id: 'policija', local: 'Gdje je policijska postaja?', english: 'Where is the police station?', pronunciation: 'gdyeh yeh poh-LEE-tsee-skah poh-STAH-yah', country: 'croatia', category: 'Emergency' },
    { id: 'policija-mne', local: 'Gdje je policijska stanica?', english: 'Where is the police station?', pronunciation: 'gdyeh yeh poh-LEE-tsee-skah STAH-nee-tsah', country: 'montenegro', category: 'Emergency' },
    { id: 'auto-kvar', local: 'Automobil se pokvario.', english: 'The car broke down.', pronunciation: 'ow-toh-MOH-beel seh poh-KVAH-ree-oh', country: 'croatia', category: 'Problems' },
    { id: 'auto-kvar-mne', local: 'Auto se pokvario.', english: 'The car broke down.', pronunciation: 'OW-toh seh poh-KVAH-ree-oh', country: 'montenegro', category: 'Problems' },
    { id: 'hotel-ne-mogu', local: 'Ne mogu pronaći hotel.', english: 'I can’t find the hotel.', pronunciation: 'neh MOH-goo proh-NAH-chee hoh-TEHL', country: 'shared', category: 'Problems' }
  ];

  const lessons = [
    {
      id: 1,
      title: 'Sound map & rescue language',
      country: 'shared',
      location: 'Before departure',
      minutes: 22,
      mission: 'Recognize the key sounds and recover when a conversation moves too quickly.',
      objective: 'Use five rescue phrases without switching immediately to English.',
      phraseIds: ['dobar-dan','hvala','molim','ne-razumijem','ponoviti','sporije','engleski','pokazati'],
      soundTip: 'Each letter is usually pronounced consistently. Focus on č/ć ≈ “ch,” š = “sh,” ž = the sound in “measure,” and j = “y.”',
      dialogue: [
        { speaker: 'local', local: 'Dobar dan. Izvolite?', english: 'Hello. How can I help?' },
        { speaker: 'you', local: 'Dobar dan. Govorim samo malo hrvatski.', english: 'Hello. I speak only a little Croatian.' },
        { speaker: 'local', local: 'Naravno. Što trebate?', english: 'Of course. What do you need?' },
        { speaker: 'you', local: 'Ne razumijem. Sporije, molim.', english: 'I don’t understand. More slowly, please.' },
        { speaker: 'local', local: 'Polako. Mogu li vam pomoći?', english: 'Slowly. Can I help you?' },
        { speaker: 'you', local: 'Hvala.', english: 'Thank you.' }
      ],
      quiz: [
        { prompt: 'You did not understand. What is the best first response?', options: ['Ne razumijem.','Koliko košta?','Račun, molim.'], answer: 0, explanation: '“Ne razumijem” means “I don’t understand.”' },
        { prompt: 'Which phrase asks the speaker to slow down?', options: ['Možete li mi pokazati?','Sporije, molim.','Govorite li engleski?'], answer: 1, explanation: '“Sporije, molim” means “More slowly, please.”' },
        { prompt: 'What does “Hvala” mean?', options: ['Please','Excuse me','Thank you'], answer: 2, explanation: '“Hvala” is the everyday word for “Thank you.”' }
      ],
      scenario: {
        title: 'The unexpected reply', role: 'Café employee',
        steps: [
          { line: 'Dobar dan. Izvolite?', english: 'Hello. What can I get you?', choices: [
            { local: 'Dobar dan.', english: 'Hello.', quality: 'good', feedback: 'Good opening. Now listen for the question.' },
            { local: 'Račun, molim.', english: 'The bill, please.', quality: 'retry', feedback: 'That ends a meal. Start with a greeting.' }
          ]},
          { line: 'Želite li nešto popiti?', english: 'Would you like something to drink?', choices: [
            { local: 'Ne razumijem. Možete li ponoviti?', english: 'I don’t understand. Can you repeat?', quality: 'good', feedback: 'Excellent recovery strategy.' },
            { local: 'Gdje je parking?', english: 'Where is the parking?', quality: 'retry', feedback: 'Useful phrase, but not for this question.' }
          ]},
          { line: 'Naravno. Piće?', english: 'Of course. A drink?', choices: [
            { local: 'Da, hvala.', english: 'Yes, thank you.', quality: 'good', feedback: 'Conversation recovered without English.' },
            { local: 'Sporije, molim.', english: 'More slowly, please.', quality: 'okay', feedback: 'Still valid, although the question is now very short.' }
          ]}
        ]
      }
    },
    {
      id: 2,
      title: 'Greetings & introductions',
      country: 'shared',
      location: 'Hotels, cafés and neighbors',
      minutes: 24,
      mission: 'Introduce yourself and exchange a few friendly details.',
      objective: 'Complete a 60-second greeting without reading a script.',
      phraseIds: ['dobro-jutro','dobra-vecer','dobro-vece','zovem-se','iz-ohija','na-odmoru','drago-mi-je','kako-ste','dobro-sam','svida-se','volimo'],
      soundTip: 'Stress is not marked in writing. Aim for clear syllables rather than forcing an English rhythm.',
      dialogue: [
        { speaker: 'local', local: 'Dobro jutro. Kako ste?', english: 'Good morning. How are you?' },
        { speaker: 'you', local: 'Dobro sam, hvala. Zovem se {name}.', english: 'I’m well, thank you. My name is {name}.' },
        { speaker: 'local', local: 'Drago mi je. Odakle ste?', english: 'Nice to meet you. Where are you from?' },
        { speaker: 'you', local: 'Ja sam iz Ohija. Na odmoru smo.', english: 'I’m from Ohio. We’re on vacation.' },
        { speaker: 'local', local: 'Sviđa li vam se ovdje?', english: 'Do you like it here?' },
        { speaker: 'you', local: 'Da. Sviđa nam se ovdje.', english: 'Yes. We like it here.' }
      ],
      quiz: [
        { prompt: 'How do you say “My name is Dave”?', options: ['Ja sam Dave.','Zovem se Dave.','Kako ste, Dave?'], answer: 1, explanation: '“Zovem se…” is the standard introduction pattern.' },
        { prompt: 'Which phrase means “Nice to meet you”?', options: ['Drago mi je.','Dobro sam.','Na odmoru smo.'], answer: 0, explanation: '“Drago mi je” literally conveys that the meeting is pleasing.' },
        { prompt: 'A local asks “Kako ste?” What are they asking?', options: ['Where are you from?','How are you?','What is your name?'], answer: 1, explanation: '“Kako ste?” is the polite form of “How are you?”' }
      ],
      scenario: {
        title: 'Meet your hotel host', role: 'Host in Perast',
        steps: [
          { line: 'Dobro veče. Ja sam Ana.', english: 'Good evening. I’m Ana.', choices: [
            { local: 'Drago mi je. Zovem se {name}.', english: 'Nice to meet you. My name is {name}.', quality: 'good', feedback: 'Natural and complete.' },
            { local: 'Koliko košta?', english: 'How much is it?', quality: 'retry', feedback: 'Save that for a transaction.' }
          ]},
          { line: 'Odakle ste?', english: 'Where are you from?', choices: [
            { local: 'Ja sam iz Ohija.', english: 'I’m from Ohio.', quality: 'good', feedback: 'Exactly right.' },
            { local: 'Na odmoru smo.', english: 'We’re on vacation.', quality: 'okay', feedback: 'Relevant, but it does not answer where you are from.' }
          ]},
          { line: 'Volite li planine?', english: 'Do you like mountains?', choices: [
            { local: 'Da. Volimo planinarenje.', english: 'Yes. We like hiking.', quality: 'good', feedback: 'A useful bridge into small talk.' },
            { local: 'Ne razumijem.', english: 'I don’t understand.', quality: 'okay', feedback: 'A valid rescue phrase whenever you need it.' }
          ]}
        ]
      }
    },
    {
      id: 3,
      title: 'Numbers, time & money',
      country: 'shared',
      location: 'Tickets, shops and schedules',
      minutes: 26,
      mission: 'Catch prices and departure times—the information that matters most.',
      objective: 'Understand three spoken prices and three times at natural speed.',
      phraseIds: ['brojevi-1-5','brojevi-6-10','koliko-kosta','dvadeset-eura','karticom','gotovinom','u-koliko-sati','u-deset','danas','danas-mne','koliko-dugo'],
      soundTip: 'Listen for the ending: “-naest” often signals the teens, while “-deset” signals tens.',
      dialogue: [
        { speaker: 'you', local: 'Koliko košta?', english: 'How much does it cost?' },
        { speaker: 'local', local: 'Dvadeset eura.', english: 'Twenty euros.' },
        { speaker: 'you', local: 'Mogu li platiti karticom?', english: 'Can I pay by card?' },
        { speaker: 'local', local: 'Može. Polazak je u deset sati.', english: 'Yes. Departure is at ten o’clock.' },
        { speaker: 'you', local: 'Koliko dugo traje?', english: 'How long does it take?' },
        { speaker: 'local', local: 'Oko jedan sat.', english: 'About one hour.' }
      ],
      quiz: [
        { prompt: 'You hear “Dvadeset eura.” What is the price?', options: ['€12','€20','€200'], answer: 1, explanation: '“Dvadeset” means twenty.' },
        { prompt: 'What does “U koliko sati?” ask?', options: ['How much?','At what time?','How far?'], answer: 1, explanation: 'Use it for departure, breakfast, checkout and opening times.' },
        { prompt: 'A sign says “Samo gotovinom.” What should you expect?', options: ['Cash only','Cards only','Free admission'], answer: 0, explanation: '“Gotovina” means cash.' }
      ],
      scenario: {
        title: 'Buy two tickets', role: 'Ticket clerk',
        steps: [
          { line: 'Dvije karte su trideset eura.', english: 'Two tickets are thirty euros.', choices: [
            { local: 'Trideset eura?', english: 'Thirty euros?', quality: 'good', feedback: 'Repeating the amount is a smart confirmation.' },
            { local: 'U koliko sati?', english: 'At what time?', quality: 'okay', feedback: 'Useful next question, but confirm the price first.' }
          ]},
          { line: 'Da, trideset. Polazak je u deset i petnaest.', english: 'Yes, thirty. Departure is at 10:15.', choices: [
            { local: 'U deset i petnaest. Hvala.', english: 'At 10:15. Thank you.', quality: 'good', feedback: 'You confirmed the critical time.' },
            { local: 'Ne razumijem.', english: 'I don’t understand.', quality: 'okay', feedback: 'Use this if you truly missed the time.' }
          ]},
          { line: 'Kartica ili gotovina?', english: 'Card or cash?', choices: [
            { local: 'Karticom, molim.', english: 'By card, please.', quality: 'good', feedback: 'Transaction complete.' },
            { local: 'Koliko košta?', english: 'How much is it?', quality: 'retry', feedback: 'You already confirmed the price.' }
          ]}
        ]
      }
    },
    {
      id: 4,
      title: 'Cafés & restaurants',
      country: 'shared',
      location: 'Perast waterfront to Dubrovnik Old Town',
      minutes: 28,
      mission: 'Order drinks and a meal, handle one follow-up question and pay.',
      objective: 'Complete a café interaction without English.',
      phraseIds: ['jednu-kavu','jednu-kafu','dva-piva','negazirana','gazirana','jelovnik','meni','sto-slobodan','sto-slobodan-mne','sjesti-vani','sjesti-napolju','naruciti','lokalno','lokalno-mne','racun'],
      soundTip: 'The final vowel matters: kava/kafu changes by local standard and grammatical role. Learn the full phrase as one unit.',
      dialogue: [
        { speaker: 'you', local: 'Dobar dan. Je li ovaj stol slobodan?', english: 'Hello. Is this table free?' },
        { speaker: 'local', local: 'Da, izvolite. Želite li jelovnik?', english: 'Yes, go ahead. Would you like a menu?' },
        { speaker: 'you', local: 'Da, hvala. I jednu kavu, molim.', english: 'Yes, thank you. And one coffee, please.' },
        { speaker: 'local', local: 'S mlijekom?', english: 'With milk?' },
        { speaker: 'you', local: 'Ne, hvala.', english: 'No, thank you.' },
        { speaker: 'you', local: 'Račun, molim. Mogu li platiti karticom?', english: 'The bill, please. Can I pay by card?' }
      ],
      quiz: [
        { prompt: 'Which word should you use for coffee in Croatia?', options: ['kava','kafa','čaj'], answer: 0, explanation: '“Kava” is the locally preferred Croatian form.' },
        { prompt: 'Which phrase asks to sit outside in Montenegro mode?', options: ['Možemo li sjesti napolju?','Možemo li dobiti meni?','Dva piva, molim.'], answer: 0, explanation: '“Napolju” means outside.' },
        { prompt: 'What ends the meal politely?', options: ['Račun, molim.','Dobro jutro.','Gdje je trajekt?'], answer: 0, explanation: '“Račun, molim” asks for the bill.' }
      ],
      scenario: {
        title: 'Waterfront lunch', role: 'Server',
        steps: [
          { line: 'Dobar dan. Imate li rezervaciju?', english: 'Hello. Do you have a reservation?', choices: [
            { local: 'Nemamo. Je li ovaj sto slobodan?', english: 'We don’t. Is this table free?', quality: 'good', feedback: 'Clear and relevant.' },
            { local: 'Jednu kafu, molim.', english: 'One coffee, please.', quality: 'okay', feedback: 'The server first needs to seat you.' }
          ]},
          { line: 'Jeste. Želite li sjesti napolju?', english: 'It is. Would you like to sit outside?', choices: [
            { local: 'Da, uz more, molim.', english: 'Yes, by the sea, please.', quality: 'good', feedback: 'Perfect for Perast.' },
            { local: 'Ne razumijem.', english: 'I don’t understand.', quality: 'okay', feedback: 'Always valid if the full sentence was too fast.' }
          ]},
          { line: 'Šta želite popiti?', english: 'What would you like to drink?', choices: [
            { local: 'Dva piva i negaziranu vodu, molim.', english: 'Two beers and still water, please.', quality: 'good', feedback: 'Order complete.' },
            { local: 'Račun, molim.', english: 'The bill, please.', quality: 'retry', feedback: 'Too early—the server is taking the drink order.' }
          ]}
        ]
      }
    },
    {
      id: 5,
      title: 'Hotels & directions',
      country: 'shared',
      location: 'Every stop on the route',
      minutes: 27,
      mission: 'Check in, confirm practical details and follow simple directions.',
      objective: 'Understand left, right and straight in a three-step route.',
      phraseIds: ['rezervacija','dvije-noci','dorucak-hr','dorucak-mne','wifi','checkout','pogled-more','gdje-je','na-karti','ravno','lijevo','desno','koliko-daleko','pjesice'],
      soundTip: '“Gdje” begins with a compressed sound. Do not add a full English “guh” before it.',
      dialogue: [
        { speaker: 'you', local: 'Dobar dan. Imamo rezervaciju na ime {name}.', english: 'Hello. We have a reservation under {name}.' },
        { speaker: 'local', local: 'Da. Ostajete li dvije noći?', english: 'Yes. Are you staying two nights?' },
        { speaker: 'you', local: 'Da. Je li doručak uključen?', english: 'Yes. Is breakfast included?' },
        { speaker: 'local', local: 'Jest. Od sedam do deset.', english: 'Yes. From seven to ten.' },
        { speaker: 'you', local: 'Koja je lozinka za Wi-Fi?', english: 'What is the Wi-Fi password?' },
        { speaker: 'local', local: 'Piše na kartici u sobi.', english: 'It is written on the card in the room.' }
      ],
      quiz: [
        { prompt: '“Skrenite desno” tells you to…', options: ['turn right','turn left','go straight'], answer: 0, explanation: '“Desno” is right.' },
        { prompt: 'Which question confirms breakfast?', options: ['Je li doručak uključen?','U koliko sati je odjava?','Koja je lozinka?'], answer: 0, explanation: '“Uključen” means included.' },
        { prompt: 'What does “pješice” mean?', options: ['by car','on foot','by ferry'], answer: 1, explanation: 'Use it to ask whether a destination is walkable.' }
      ],
      scenario: {
        title: 'Check in and find parking', role: 'Hotel receptionist',
        steps: [
          { line: 'Dobar dan. Kako vam mogu pomoći?', english: 'Hello. How can I help?', choices: [
            { local: 'Imamo rezervaciju na ime {name}.', english: 'We have a reservation under {name}.', quality: 'good', feedback: 'A complete check-in opening.' },
            { local: 'Gdje je trajekt?', english: 'Where is the ferry?', quality: 'retry', feedback: 'First establish your reservation.' }
          ]},
          { line: 'Da, tri noći. Doručak je od sedam.', english: 'Yes, three nights. Breakfast is from seven.', choices: [
            { local: 'Hvala. Koja je lozinka za Wi-Fi?', english: 'Thanks. What is the Wi-Fi password?', quality: 'good', feedback: 'You understood the stay and moved to a practical detail.' },
            { local: 'Sporije, molim.', english: 'More slowly, please.', quality: 'okay', feedback: 'Good recovery if the time was unclear.' }
          ]},
          { line: 'Wi-Fi je “Perast2026”. Parking je iza hotela.', english: 'Wi-Fi is “Perast2026.” Parking is behind the hotel.', choices: [
            { local: 'Možete li mi pokazati na karti?', english: 'Can you show me on the map?', quality: 'good', feedback: 'Excellent when spoken directions are not enough.' },
            { local: 'Račun, molim.', english: 'The bill, please.', quality: 'retry', feedback: 'That does not fit a check-in.' }
          ]}
        ]
      }
    },
    {
      id: 6,
      title: 'Rental car at Dubrovnik Airport',
      country: 'croatia',
      location: 'Dubrovnik Airport (DBV)',
      minutes: 30,
      mission: 'Collect the car and confirm cross-border insurance, documents and fuel.',
      objective: 'Ask the three questions that protect the rest of the road trip.',
      phraseIds: ['rezervacija-auto','osiguranje-hr','dokumenti-auto','benzin-dizel','vratiti-auto','parking-hr','parkirati-hr','benzinska-hr','do-vrha','zracna-luka'],
      soundTip: 'Croatian “zračna luka” literally means air port. Learn it as the local airport term.',
      dialogue: [
        { speaker: 'you', local: 'Dobar dan. Imam rezervaciju za automobil.', english: 'Hello. I have a car reservation.' },
        { speaker: 'local', local: 'Vaša putovnica i vozačka dozvola, molim.', english: 'Your passport and driver’s license, please.' },
        { speaker: 'you', local: 'Evo. Je li osiguranje važeće u Crnoj Gori?', english: 'Here you are. Is the insurance valid in Montenegro?' },
        { speaker: 'local', local: 'Da. Dokumenti su u pretincu.', english: 'Yes. The documents are in the glove compartment.' },
        { speaker: 'you', local: 'Je li ovo benzin ili dizel?', english: 'Is this gasoline or diesel?' },
        { speaker: 'local', local: 'Benzin. Vraćate ga s punim spremnikom.', english: 'Gasoline. Return it with a full tank.' }
      ],
      quiz: [
        { prompt: 'Which question confirms coverage in Montenegro?', options: ['Je li osiguranje važeće u Crnoj Gori?','Gdje je parkiralište?','Koliko traje vožnja?'], answer: 0, explanation: 'It directly asks whether the insurance is valid across the border.' },
        { prompt: '“Vraćate ga s punim spremnikom” means the car should be returned…', options: ['clean','with a full tank','before noon'], answer: 1, explanation: '“Pun spremnik” is a full tank.' },
        { prompt: 'What local Croatian term means airport?', options: ['aerodrom','zračna luka','autobusna stanica'], answer: 1, explanation: 'Croatian commonly uses “zračna luka.”' }
      ],
      scenario: {
        title: 'The three critical questions', role: 'Rental agent',
        steps: [
          { line: 'Evo ključeva. Potpišite ovdje.', english: 'Here are the keys. Sign here.', choices: [
            { local: 'Je li osiguranje važeće u Crnoj Gori?', english: 'Is the insurance valid in Montenegro?', quality: 'good', feedback: 'Ask this before leaving the desk.' },
            { local: 'Gdje je Stari grad?', english: 'Where is the Old Town?', quality: 'retry', feedback: 'Save directions until the rental terms are clear.' }
          ]},
          { line: 'Da, ali dokumenti moraju biti u autu.', english: 'Yes, but the documents must remain in the car.', choices: [
            { local: 'Koje dokumente trebam za automobil?', english: 'Which documents do I need for the car?', quality: 'good', feedback: 'You clarified exactly what to carry.' },
            { local: 'Mogu li platiti karticom?', english: 'Can I pay by card?', quality: 'okay', feedback: 'Useful, but the document requirement is more important now.' }
          ]},
          { line: 'Prometna dozvola i potvrda osiguranja. Auto je na benzin.', english: 'Registration and insurance certificate. The car uses gasoline.', choices: [
            { local: 'Gdje vraćam automobil?', english: 'Where do I return the car?', quality: 'good', feedback: 'All major collection questions covered.' },
            { local: 'Je li ovo dizel?', english: 'Is this diesel?', quality: 'okay', feedback: 'The agent already told you it uses gasoline.' }
          ]}
        ]
      }
    },
    {
      id: 7,
      title: 'Border crossing & road to Perast',
      country: 'shared',
      location: 'Croatia–Montenegro border',
      minutes: 25,
      mission: 'Answer destination and vehicle questions calmly at the border.',
      objective: 'Recognize requests for passports and vehicle documents.',
      phraseIds: ['putovnice','pasosi','perast-tri','rentani-auto','povratak-hr','dokumenti-auto-mne','osiguranje-mne','parking-mne'],
      soundTip: 'At the border, listen for “pasoš/putovnica,” “dokumenti,” “auto/automobil,” and “koliko dana.”',
      dialogue: [
        { speaker: 'local', local: 'Dobar dan. Pasoši, molim.', english: 'Hello. Passports, please.' },
        { speaker: 'you', local: 'Dobar dan. Evo naših pasoša.', english: 'Hello. Here are our passports.' },
        { speaker: 'local', local: 'Kuda putujete?', english: 'Where are you traveling?' },
        { speaker: 'you', local: 'Idemo u Perast na tri noći.', english: 'We’re going to Perast for three nights.' },
        { speaker: 'local', local: 'Je li ovo vaš automobil?', english: 'Is this your car?' },
        { speaker: 'you', local: 'Ne. Ovo je iznajmljeni automobil.', english: 'No. This is a rental car.' }
      ],
      quiz: [
        { prompt: 'The officer says “Pasoši, molim.” What do they want?', options: ['rental agreement','passports','hotel booking'], answer: 1, explanation: '“Pasoši” is the plural of passport used in Montenegro.' },
        { prompt: 'How do you say the car is rented?', options: ['Ovo je iznajmljeni automobil.','Auto se pokvario.','Gdje vraćam auto?'], answer: 0, explanation: 'This clearly distinguishes it from a privately owned car.' },
        { prompt: '“Kuda putujete?” is asking…', options: ['Where are you traveling?','How long is the line?','What fuel do you need?'], answer: 0, explanation: 'Answer with your destination and length of stay.' }
      ],
      scenario: {
        title: 'Border window', role: 'Border officer',
        steps: [
          { line: 'Pasoši i dokumenta za auto, molim.', english: 'Passports and car documents, please.', choices: [
            { local: 'Evo naših pasoša i dokumenata.', english: 'Here are our passports and documents.', quality: 'good', feedback: 'Direct and complete.' },
            { local: 'Govorite li engleski?', english: 'Do you speak English?', quality: 'okay', feedback: 'Valid if you did not understand the request.' }
          ]},
          { line: 'Gdje idete i koliko ostajete?', english: 'Where are you going and how long are you staying?', choices: [
            { local: 'Idemo u Perast na tri noći.', english: 'We’re going to Perast for three nights.', quality: 'good', feedback: 'Both requested details answered.' },
            { local: 'Vraćamo se u Hrvatsku.', english: 'We’re returning to Croatia.', quality: 'okay', feedback: 'Useful but incomplete.' }
          ]},
          { line: 'Kada se vraćate u Hrvatsku?', english: 'When are you returning to Croatia?', choices: [
            { local: 'Vraćamo se u petak.', english: 'We return on Friday.', quality: 'good', feedback: 'Border interaction complete.' },
            { local: 'Ne razumijem. Možete li ponoviti?', english: 'I don’t understand. Can you repeat?', quality: 'okay', feedback: 'A safe response if the date question was too fast.' }
          ]}
        ]
      }
    },
    {
      id: 8,
      title: 'Perast: parking, hotel & boats',
      country: 'montenegro',
      location: 'Perast, Montenegro',
      minutes: 31,
      mission: 'Arrive, park, check in and arrange a boat trip.',
      objective: 'Complete one continuous Perast arrival simulation.',
      phraseIds: ['parking-hotel','parking-mne','parkirati-mne','rezervacija','dorucak-mne','brod-gospa','brod-kada','brod-povratak','dvije-povratne','zadnji-brod','uz-more','jednu-kafu'],
      soundTip: 'Montenegro mode favors words such as “kafa,” “parking,” “pasoš” and question forms beginning with “Da li…”.',
      dialogue: [
        { speaker: 'you', local: 'Izvinite. Gdje možemo parkirati kod hotela?', english: 'Excuse me. Where can we park near the hotel?' },
        { speaker: 'local', local: 'Parking je iznad hotela, lijevo.', english: 'The parking is above the hotel, on the left.' },
        { speaker: 'you', local: 'Hvala. Možete li mi pokazati?', english: 'Thanks. Can you show me?' },
        { speaker: 'local', local: 'Naravno. Idite ravno pa lijevo.', english: 'Of course. Go straight, then left.' },
        { speaker: 'you', local: 'Odakle polazi brod za Gospu od Škrpjela?', english: 'Where does the boat to Our Lady of the Rocks leave from?' },
        { speaker: 'local', local: 'S rive, svakih pola sata.', english: 'From the waterfront, every half hour.' }
      ],
      quiz: [
        { prompt: 'In Montenegro mode, what is the most natural word for coffee here?', options: ['kava','kafa','kruh'], answer: 1, explanation: '“Kafa” is the locally preferred form.' },
        { prompt: '“Iznad hotela, lijevo” places the parking…', options: ['below the hotel, right','above the hotel, left','behind the hotel, straight'], answer: 1, explanation: '“Iznad” is above and “lijevo” is left.' },
        { prompt: 'How do you request two return boat tickets?', options: ['Dvije povratne karte, molim.','Dva piva, molim.','Kada je odjava?'], answer: 0, explanation: '“Povratne karte” are return tickets.' }
      ],
      scenario: {
        title: 'Perast arrival circuit', role: 'Hotel host',
        steps: [
          { line: 'Dobro došli. Imate li auto?', english: 'Welcome. Do you have a car?', choices: [
            { local: 'Da. Gdje možemo parkirati?', english: 'Yes. Where can we park?', quality: 'good', feedback: 'This addresses Perast’s first practical issue.' },
            { local: 'Dvije karte, molim.', english: 'Two tickets, please.', quality: 'retry', feedback: 'Boat tickets come later.' }
          ]},
          { line: 'Parking je iznad hotela. Ostajete tri noći?', english: 'Parking is above the hotel. Are you staying three nights?', choices: [
            { local: 'Da. Imamo rezervaciju na ime {name}.', english: 'Yes. We have a reservation under {name}.', quality: 'good', feedback: 'Arrival and reservation linked naturally.' },
            { local: 'Ne razumijem.', english: 'I don’t understand.', quality: 'okay', feedback: 'Use this if you missed the stay-length question.' }
          ]},
          { line: 'Da. Doručak je od osam. Želite li informacije o brodu?', english: 'Yes. Breakfast is from eight. Would you like boat information?', choices: [
            { local: 'Da. Kada polazi sljedeći brod?', english: 'Yes. When does the next boat leave?', quality: 'good', feedback: 'Full Perast arrival mission complete.' },
            { local: 'Račun, molim.', english: 'The bill, please.', quality: 'retry', feedback: 'You are checking in, not checking out.' }
          ]}
        ]
      }
    },
    {
      id: 9,
      title: 'Žabljak: fuel, weather & hiking',
      country: 'montenegro',
      location: 'Žabljak and Durmitor',
      minutes: 30,
      mission: 'Check road and trail conditions before heading into the mountains.',
      objective: 'Understand whether a road or trail is open, difficult or slippery.',
      phraseIds: ['put-otvoren','uslovi-put','benzinska-mne','staza-otvorena','pocetak-staze','crno-jezero','vrijeme-planina','jakna','staza-klizava','teska-staza','pogled'],
      soundTip: 'In fast replies, listen for “otvoren/a” (open), “zatvoren/a” (closed), “klizavo” (slippery) and “sigurno” (safe).',
      dialogue: [
        { speaker: 'you', local: 'Dobar dan. Da li je put otvoren?', english: 'Hello. Is the road open?' },
        { speaker: 'local', local: 'Jeste, ali je mokar i ima magle.', english: 'Yes, but it is wet and foggy.' },
        { speaker: 'you', local: 'Hvala. Gdje je najbliža benzinska pumpa?', english: 'Thanks. Where is the nearest gas station?' },
        { speaker: 'local', local: 'Ravno, pa desno kod kružnog toka.', english: 'Straight, then right at the roundabout.' },
        { speaker: 'you', local: 'Koliko traje šetnja oko Crnog jezera?', english: 'How long is the walk around Black Lake?' },
        { speaker: 'local', local: 'Oko sat i po. Staza je malo klizava.', english: 'About an hour and a half. The trail is a little slippery.' }
      ],
      quiz: [
        { prompt: 'A local says “Staza je zatvorena.” What does that mean?', options: ['The trail is open.','The trail is closed.','The trail is easy.'], answer: 1, explanation: '“Zatvorena” means closed.' },
        { prompt: 'Which question asks about road conditions?', options: ['Kakvi su uslovi na putu?','Gdje je najbolji pogled?','Koliko košta parking?'], answer: 0, explanation: '“Uslovi na putu” means conditions on the road.' },
        { prompt: '“Sat i po” is approximately…', options: ['30 minutes','90 minutes','2.5 hours'], answer: 1, explanation: 'It literally means an hour and a half.' }
      ],
      scenario: {
        title: 'Ask before hiking', role: 'Visitor center staff',
        steps: [
          { line: 'Dobar dan. Kako mogu pomoći?', english: 'Hello. How can I help?', choices: [
            { local: 'Da li je staza oko Crnog jezera otvorena?', english: 'Is the trail around Black Lake open?', quality: 'good', feedback: 'Specific and safety-focused.' },
            { local: 'Jednu kafu, molim.', english: 'One coffee, please.', quality: 'retry', feedback: 'This is the visitor center, not a café.' }
          ]},
          { line: 'Otvorena je, ali je poslije kiše klizava.', english: 'It is open, but slippery after the rain.', choices: [
            { local: 'Koliko traje šetnja?', english: 'How long is the walk?', quality: 'good', feedback: 'You understood the condition and asked about duration.' },
            { local: 'Da li je put otvoren?', english: 'Is the road open?', quality: 'okay', feedback: 'Useful, though the current topic is the trail.' }
          ]},
          { line: 'Oko sat i po. Ponesite jaknu.', english: 'About an hour and a half. Bring a jacket.', choices: [
            { local: 'Hvala. Gdje počinje staza?', english: 'Thanks. Where does the trail start?', quality: 'good', feedback: 'You now have condition, duration and start point.' },
            { local: 'Sporije, molim.', english: 'More slowly, please.', quality: 'okay', feedback: 'Use this if the advice was too fast.' }
          ]}
        ]
      }
    },
    {
      id: 10,
      title: 'Switch to Croatia & reach Korčula',
      country: 'croatia',
      location: 'Ferry connection to Korčula',
      minutes: 29,
      mission: 'Switch vocabulary and navigate a vehicle ferry confidently.',
      objective: 'Confirm departure point, boarding line and arrival time.',
      phraseIds: ['dobra-vecer','oprostite','jednu-kavu','sto-slobodan','trajekt-korcula','zadnji-trajekt','karte-trajekt','red-ukrcaj','auto-trajekt','koliko-ranije','putovnice'],
      soundTip: 'Croatia mode now favors “kava,” “putovnica,” “zračna luka,” “ljekarna,” and “Je li…?”',
      dialogue: [
        { speaker: 'you', local: 'Oprostite. Odakle polazi trajekt za Korčulu?', english: 'Excuse me. Where does the ferry to Korčula leave from?' },
        { speaker: 'local', local: 'S drugog pristaništa. Imate li automobil?', english: 'From the other dock. Do you have a car?' },
        { speaker: 'you', local: 'Da. Je li ovo red za ukrcaj?', english: 'Yes. Is this the line for boarding?' },
        { speaker: 'local', local: 'Ne, red za automobile je lijevo.', english: 'No, the line for cars is on the left.' },
        { speaker: 'you', local: 'Koliko ranije trebamo doći?', english: 'How early should we arrive?' },
        { speaker: 'local', local: 'Najmanje trideset minuta ranije.', english: 'At least thirty minutes early.' }
      ],
      quiz: [
        { prompt: 'What does “ukrcaj” refer to?', options: ['boarding','parking payment','hotel checkout'], answer: 0, explanation: '“Ukrcaj” is boarding or loading onto the ferry.' },
        { prompt: 'In Croatia mode, “Oprostite” is used to…', options: ['ask for the bill','say excuse me','confirm a reservation'], answer: 1, explanation: 'It is the common Croatian courtesy opener.' },
        { prompt: 'The car line is “lijevo.” Which direction?', options: ['left','right','straight'], answer: 0, explanation: '“Lijevo” is left.' }
      ],
      scenario: {
        title: 'Find the correct ferry lane', role: 'Port employee',
        steps: [
          { line: 'Kamo putujete?', english: 'Where are you traveling?', choices: [
            { local: 'Za Korčulu. Imamo automobil.', english: 'To Korčula. We have a car.', quality: 'good', feedback: 'Destination and vehicle stated together.' },
            { local: 'Gdje je zračna luka?', english: 'Where is the airport?', quality: 'retry', feedback: 'Wrong transport context.' }
          ]},
          { line: 'Karte imate?', english: 'Do you have tickets?', choices: [
            { local: 'Ne. Gdje možemo kupiti karte?', english: 'No. Where can we buy tickets?', quality: 'good', feedback: 'Natural and actionable.' },
            { local: 'Koliko je do Starog grada?', english: 'How far is the Old Town?', quality: 'retry', feedback: 'First solve the ticket problem.' }
          ]},
          { line: 'Na kiosku desno. Zatim u red broj tri.', english: 'At the kiosk on the right. Then lane number three.', choices: [
            { local: 'Desno, pa red broj tri. Hvala.', english: 'Right, then lane three. Thank you.', quality: 'good', feedback: 'You repeated the key directions accurately.' },
            { local: 'Ne razumijem.', english: 'I don’t understand.', quality: 'okay', feedback: 'Valid if you missed the lane number.' }
          ]}
        ]
      }
    },
    {
      id: 11,
      title: 'Korčula: town, beach & boat day',
      country: 'croatia',
      location: 'Korčula',
      minutes: 28,
      mission: 'Move around town and arrange a low-stress coastal activity.',
      objective: 'Ask for a quiet beach or boat outing and understand the return time.',
      phraseIds: ['pjesice-stari-grad','mirna-plaza','autobus-stanica','izlet-brodom','povratak-izlet','preporuciti','koliko-daleko','na-karti','sjesti-vani','lokalno'],
      soundTip: 'The letter “č” in Korčula is a clear “ch” sound: KOR-choo-lah.',
      dialogue: [
        { speaker: 'you', local: 'Dobar dan. Koliko je do Starog grada pješice?', english: 'Hello. How far is the Old Town on foot?' },
        { speaker: 'local', local: 'Deset minuta ravno uz more.', english: 'Ten minutes straight along the sea.' },
        { speaker: 'you', local: 'Možete li preporučiti mirnu plažu?', english: 'Can you recommend a quiet beach?' },
        { speaker: 'local', local: 'Da. Žrnovska Banja je blizu.', english: 'Yes. Žrnovska Banja is nearby.' },
        { speaker: 'you', local: 'Ima li danas izlet brodom?', english: 'Is there a boat excursion today?' },
        { speaker: 'local', local: 'Da, polazak je u dva, povratak u šest.', english: 'Yes, departure is at two, return at six.' }
      ],
      quiz: [
        { prompt: 'What does “pješice” tell you?', options: ['by boat','on foot','by bus'], answer: 1, explanation: 'The question asks for walking distance.' },
        { prompt: '“Povratak u šest” means…', options: ['return at six','leave at six','six tickets'], answer: 0, explanation: '“Povratak” means return.' },
        { prompt: 'Which question seeks a quieter beach?', options: ['Možete li preporučiti mirnu plažu?','Gdje je autobusna stanica?','Je li ovaj stol slobodan?'], answer: 0, explanation: '“Mirnu plažu” is a quiet beach.' }
      ],
      scenario: {
        title: 'Plan a relaxed afternoon', role: 'Local shopkeeper',
        steps: [
          { line: 'Dobar dan. Trebate li pomoć?', english: 'Hello. Do you need help?', choices: [
            { local: 'Da. Možete li preporučiti mirnu plažu?', english: 'Yes. Can you recommend a quiet beach?', quality: 'good', feedback: 'Matches your preference and gets local advice.' },
            { local: 'Račun, molim.', english: 'The bill, please.', quality: 'retry', feedback: 'You have not made a purchase.' }
          ]},
          { line: 'Pupnatska Luka je lijepa, ali trebate auto.', english: 'Pupnatska Luka is beautiful, but you need a car.', choices: [
            { local: 'Koliko je daleko?', english: 'How far is it?', quality: 'good', feedback: 'The right follow-up.' },
            { local: 'Možemo li tamo pješice?', english: 'Can we walk there?', quality: 'okay', feedback: 'Reasonable, though the speaker already said a car is needed.' }
          ]},
          { line: 'Oko dvadeset minuta autom.', english: 'About twenty minutes by car.', choices: [
            { local: 'Možete li mi pokazati na karti?', english: 'Can you show me on the map?', quality: 'good', feedback: 'You now have a destination you can actually find.' },
            { local: 'U koliko sati se vraćamo?', english: 'What time do we return?', quality: 'retry', feedback: 'That question belongs to a scheduled excursion.' }
          ]}
        ]
      }
    },
    {
      id: 12,
      title: 'Dubrovnik without the friction',
      country: 'croatia',
      location: 'Dubrovnik',
      minutes: 27,
      mission: 'Navigate buses, the Old Town and quieter alternatives.',
      objective: 'Reach the Old Town and ask when or where it is less crowded.',
      phraseIds: ['bus-stari-grad','ulaz-zidine','najmanja-guzva','mirniji-put','prtljaga','taksi','zracna-luka','autobus-stanica','pjesice','racun'],
      soundTip: 'Dubrovnik replies may arrive in English quickly. Start in Croatian anyway, then use rescue language if needed.',
      dialogue: [
        { speaker: 'you', local: 'Oprostite. Koji autobus ide do Starog grada?', english: 'Excuse me. Which bus goes to the Old Town?' },
        { speaker: 'local', local: 'Broj šest. Stanica je preko ceste.', english: 'Number six. The stop is across the road.' },
        { speaker: 'you', local: 'Hvala. Kada je najmanja gužva?', english: 'Thanks. When is it least crowded?' },
        { speaker: 'local', local: 'Rano ujutro ili poslije šest.', english: 'Early in the morning or after six.' },
        { speaker: 'you', local: 'Gdje je ulaz na zidine?', english: 'Where is the entrance to the walls?' },
        { speaker: 'local', local: 'Kod Vrata od Pila, desno.', english: 'At Pile Gate, on the right.' }
      ],
      quiz: [
        { prompt: '“Broj šest” identifies…', options: ['bus number six','six euros','gate six'], answer: 0, explanation: '“Broj” means number.' },
        { prompt: 'How do you ask when it is least crowded?', options: ['Kada je najmanja gužva?','Gdje je prtljaga?','Koliko košta autobus?'], answer: 0, explanation: '“Najmanja gužva” means the smallest crowd.' },
        { prompt: '“Preko ceste” means…', options: ['across the road','under the bridge','behind the hotel'], answer: 0, explanation: 'Useful to recognize in spoken directions.' }
      ],
      scenario: {
        title: 'Reach the Old Town', role: 'Hotel receptionist',
        steps: [
          { line: 'Kako mogu pomoći?', english: 'How can I help?', choices: [
            { local: 'Koji autobus ide do Starog grada?', english: 'Which bus goes to the Old Town?', quality: 'good', feedback: 'Direct and practical.' },
            { local: 'Gdje je trajekt za Korčulu?', english: 'Where is the ferry to Korčula?', quality: 'retry', feedback: 'That leg of the trip is finished.' }
          ]},
          { line: 'Broj četiri ili šest. Stanica je ispred hotela.', english: 'Number four or six. The stop is in front of the hotel.', choices: [
            { local: 'Koliko traje vožnja?', english: 'How long is the ride?', quality: 'good', feedback: 'You now know which bus and can confirm timing.' },
            { local: 'Možete li pozvati taksi?', english: 'Can you call a taxi?', quality: 'okay', feedback: 'A reasonable fallback if you prefer not to take the bus.' }
          ]},
          { line: 'Oko petnaest minuta bez gužve.', english: 'About fifteen minutes without traffic.', choices: [
            { local: 'Kada je najmanja gužva?', english: 'When is it least crowded?', quality: 'good', feedback: 'This adapts the plan to your crowd preference.' },
            { local: 'Dva piva, molim.', english: 'Two beers, please.', quality: 'retry', feedback: 'Wrong setting.' }
          ]}
        ]
      }
    },
    {
      id: 13,
      title: 'Problems, pharmacy & urgent help',
      country: 'shared',
      location: 'Anywhere on the trip',
      minutes: 26,
      mission: 'Describe a common problem and ask for the right kind of help.',
      objective: 'Communicate one lost-item, medical or vehicle problem clearly.',
      phraseIds: ['pomoc','pomoc-mne','izgubio-telefon','izgubio-novcanik','ljekarna','apoteka','koljeno','protiv-bolova','lijecnik','ljekar','hitna','policija','policija-mne','auto-kvar','auto-kvar-mne','hotel-ne-mogu'],
      soundTip: 'In an urgent situation, short nouns and verbs matter more than perfect grammar: “pomoć,” “ljekarna/apoteka,” “liječnik/ljekar,” “policija.”',
      dialogue: [
        { speaker: 'you', local: 'Oprostite. Trebam pomoć.', english: 'Excuse me. I need help.' },
        { speaker: 'local', local: 'Što se dogodilo?', english: 'What happened?' },
        { speaker: 'you', local: 'Izgubio sam telefon.', english: 'I lost my phone.' },
        { speaker: 'local', local: 'Gdje ste ga posljednji put vidjeli?', english: 'Where did you last see it?' },
        { speaker: 'you', local: 'U autobusu.', english: 'On the bus.' },
        { speaker: 'local', local: 'Nazvat ćemo autobusnu tvrtku.', english: 'We will call the bus company.' }
      ],
      quiz: [
        { prompt: 'In Croatia, which word should you look for on a pharmacy sign?', options: ['ljekarna','apoteka only','zračna luka'], answer: 0, explanation: '“Ljekarna” is the standard Croatian term.' },
        { prompt: 'In Montenegro, which phrase asks for a doctor?', options: ['Treba mi ljekar.','Trebam liječnika.','Gdje je trajekt?'], answer: 0, explanation: '“Ljekar” is the locally preferred Montenegrin term.' },
        { prompt: 'What does “Automobil se pokvario” mean?', options: ['The car was stolen.','The car broke down.','The car is parked.'], answer: 1, explanation: '“Pokvario se” means it broke down.' }
      ],
      scenario: {
        title: 'Choose the right help', role: 'Hotel front desk',
        steps: [
          { line: 'Dobar dan. Što trebate?', english: 'Hello. What do you need?', choices: [
            { local: 'Trebam ljekarnu. Boli me koljeno.', english: 'I need a pharmacy. My knee hurts.', quality: 'good', feedback: 'Problem and requested help are both clear.' },
            { local: 'Je li doručak uključen?', english: 'Is breakfast included?', quality: 'retry', feedback: 'This does not address the problem.' }
          ]},
          { line: 'Ljekarna je dvije ulice dalje. Trebate li liječnika?', english: 'The pharmacy is two streets away. Do you need a doctor?', choices: [
            { local: 'Ne, hvala. Samo nešto protiv bolova.', english: 'No, thank you. Just something for pain.', quality: 'good', feedback: 'Clear response to the offer.' },
            { local: 'Ne razumijem. Sporije, molim.', english: 'I don’t understand. More slowly, please.', quality: 'okay', feedback: 'Always appropriate when health information is unclear.' }
          ]},
          { line: 'Razumijem. Mogu vam pokazati na karti.', english: 'I understand. I can show you on the map.', choices: [
            { local: 'Da, molim. Hvala.', english: 'Yes, please. Thank you.', quality: 'good', feedback: 'You successfully obtained practical help.' },
            { local: 'Zovite hitnu pomoć.', english: 'Call an ambulance.', quality: 'retry', feedback: 'That would be appropriate only for a true emergency.' }
          ]}
        ]
      }
    },
    {
      id: 14,
      title: 'Full Adriatic circuit',
      country: 'shared',
      location: 'DBV → Perast → Žabljak → Korčula → Dubrovnik',
      minutes: 35,
      mission: 'Navigate a compressed version of the entire trip with minimal assistance.',
      objective: 'Complete five transactions, understand five critical replies and recover once.',
      phraseIds: ['osiguranje-hr','perast-tri','parking-hotel','crno-jezero','trajekt-korcula','mirna-plaza','bus-stari-grad','zracna-luka','ne-razumijem','ponoviti','hvala','racun'],
      soundTip: 'The final skill is not perfect recall—it is recognizing the situation, extracting the important information and keeping the interaction moving.',
      dialogue: [
        { speaker: 'local', local: 'Je li osiguranje važeće u Crnoj Gori?', english: 'Is the insurance valid in Montenegro?' },
        { speaker: 'you', local: 'Da. Koje dokumente trebam za automobil?', english: 'Yes. Which documents do I need for the car?' },
        { speaker: 'local', local: 'Parking je iznad hotela, pa lijevo.', english: 'Parking is above the hotel, then left.' },
        { speaker: 'you', local: 'Možete li mi pokazati na karti?', english: 'Can you show me on the map?' },
        { speaker: 'local', local: 'Trajekt polazi u deset i trideset.', english: 'The ferry leaves at 10:30.' },
        { speaker: 'you', local: 'U deset i trideset. Hvala.', english: 'At 10:30. Thank you.' }
      ],
      quiz: [
        { prompt: 'Which response demonstrates successful recovery?', options: ['Pretending to understand','Možete li ponoviti?','Ending the conversation'], answer: 1, explanation: 'Requesting repetition is a core conversational skill, not a failure.' },
        { prompt: 'In Croatia, you ask for a pharmacy using…', options: ['Trebam ljekarnu.','Treba mi apoteka.','Gdje je parking?'], answer: 0, explanation: '“Ljekarna” is the preferred Croatian term.' },
        { prompt: 'In Montenegro, which phrase sounds most local?', options: ['Jednu kavu, molim.','Jednu kafu, molim.','One coffee, please.'], answer: 1, explanation: '“Kafa” is the locally preferred form.' }
      ],
      scenario: {
        title: 'Five-stop final simulation', role: 'Adriatic guide',
        steps: [
          { line: 'Dobro došli. Prvo preuzimate auto. Šta morate provjeriti?', english: 'Welcome. First you collect the car. What must you check?', choices: [
            { local: 'Je li osiguranje važeće u Crnoj Gori?', english: 'Is the insurance valid in Montenegro?', quality: 'good', feedback: 'Correct first-trip checkpoint.' },
            { local: 'Račun, molim.', english: 'The bill, please.', quality: 'retry', feedback: 'Not yet.' }
          ]},
          { line: 'Stigli ste u Perast. Hotel nema parking ispred ulaza.', english: 'You arrived in Perast. The hotel has no parking at the entrance.', choices: [
            { local: 'Gdje možemo parkirati kod hotela?', english: 'Where can we park near the hotel?', quality: 'good', feedback: 'Correct Perast arrival question.' },
            { local: 'Gdje je zračna luka?', english: 'Where is the airport?', quality: 'retry', feedback: 'Wrong stop.' }
          ]},
          { line: 'U Žabljaku je padala kiša cijelu noć.', english: 'It rained all night in Žabljak.', choices: [
            { local: 'Da li je staza otvorena i klizava?', english: 'Is the trail open and slippery?', quality: 'good', feedback: 'You checked both access and safety.' },
            { local: 'Jednu kafu, molim.', english: 'One coffee, please.', quality: 'retry', feedback: 'Coffee can wait until conditions are known.' }
          ]},
          { line: 'U luci ne znate koji je red za Korčulu.', english: 'At the port, you do not know which line is for Korčula.', choices: [
            { local: 'Je li ovo red za ukrcaj za Korčulu?', english: 'Is this the boarding line for Korčula?', quality: 'good', feedback: 'Correct ferry checkpoint.' },
            { local: 'Koliko je do Starog grada pješice?', english: 'How far is the Old Town on foot?', quality: 'retry', feedback: 'First board the ferry.' }
          ]},
          { line: 'U Dubrovniku recepcionar govori prebrzo.', english: 'In Dubrovnik, the receptionist speaks too quickly.', choices: [
            { local: 'Ne razumijem. Sporije, molim.', english: 'I don’t understand. More slowly, please.', quality: 'good', feedback: 'Final mission complete: you recovered and kept going.' },
            { local: 'Hvala.', english: 'Thank you.', quality: 'retry', feedback: 'Do not confirm information you did not understand.' }
          ]}
        ]
      }
    }
  ];

  const trip = [
    { city: 'Dubrovnik Airport', country: 'Croatia', flag: '🇭🇷', nights: 'Arrival', focus: 'Rental car, insurance, border documents', lessonIds: [6,7] },
    { city: 'Perast', country: 'Montenegro', flag: '🇲🇪', nights: '3 nights', focus: 'Parking, hotel, boats, waterfront dining', lessonIds: [8] },
    { city: 'Žabljak', country: 'Montenegro', flag: '🇲🇪', nights: '1 night', focus: 'Fuel, road conditions, trails, weather', lessonIds: [9] },
    { city: 'Korčula', country: 'Croatia', flag: '🇭🇷', nights: '3 nights', focus: 'Ferries, walking, beaches, boat outings', lessonIds: [10,11] },
    { city: 'Dubrovnik', country: 'Croatia', flag: '🇭🇷', nights: '2 nights', focus: 'Buses, Old Town, crowds, airport', lessonIds: [12,13,14] }
  ];

  const quickCategories = [
    { name: 'Rescue', icon: '🛟', phraseIds: ['ne-razumijem','ponoviti','sporije','engleski','pokazati'] },
    { name: 'Parking', icon: '🅿️', phraseIds: ['parking-hr','parking-mne','parkirati-hr','parkirati-mne','parking-cijena','parking-hotel'] },
    { name: 'Hotel', icon: '🛎️', phraseIds: ['rezervacija','dorucak-hr','dorucak-mne','wifi','checkout'] },
    { name: 'Food', icon: '☕', phraseIds: ['jednu-kavu','jednu-kafu','negazirana','dva-piva','racun','karticom'] },
    { name: 'Boat', icon: '⛴️', phraseIds: ['brod-gospa','brod-kada','trajekt-korcula','red-ukrcaj','zadnji-trajekt'] },
    { name: 'Hiking', icon: '🥾', phraseIds: ['staza-otvorena','crno-jezero','vrijeme-planina','staza-klizava','teska-staza'] },
    { name: 'Health', icon: '➕', phraseIds: ['ljekarna','apoteka','koljeno','protiv-bolova','lijecnik','ljekar','hitna'] },
    { name: 'Directions', icon: '↗️', phraseIds: ['gdje-je','na-karti','ravno','lijevo','desno','koliko-daleko'] }
  ];

  const countryGuide = {
    croatia: {
      name: 'Croatia', flag: '🇭🇷', language: 'Croatian', speechLocale: 'hr-HR',
      preferred: [
        ['coffee', 'kava'], ['airport', 'zračna luka'], ['passport', 'putovnica'],
        ['pharmacy', 'ljekarna'], ['road', 'cesta'], ['gas station', 'benzinska postaja']
      ]
    },
    montenegro: {
      name: 'Montenegro', flag: '🇲🇪', language: 'Montenegrin', speechLocale: 'sr-RS',
      preferred: [
        ['coffee', 'kafa'], ['airport', 'aerodrom'], ['passport', 'pasoš'],
        ['pharmacy', 'apoteka'], ['road', 'put'], ['gas station', 'benzinska pumpa']
      ]
    }
  };

  window.ADRIATIC14_CONTENT = { phrases, lessons, trip, quickCategories, countryGuide };
})();
