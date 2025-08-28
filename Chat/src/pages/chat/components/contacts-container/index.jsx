// Import the SVG using a relative path
import logoSvg from '@/assets/logo-no-background.svg';
import ProfileInfo from './components';
import NewDM from './components/new-dm';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactList from '@/components/contact-list';
import CreateChannel from './components/create-channel';



const ContactsContainer = () => {
  const { setdirectMessagesContacts, directMessagesContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setdirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    getContacts();
  }, [setdirectMessagesContacts]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>

      <div className="my-5">
        <div className="flex items-center justify-center pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-center pr-10">
          <Title text="Channels" />
          <CreateChannel/>
        </div>
        {/* You can add ChannelList or similar here if needed */}
      </div>

      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      {/* Use the imported SVG file here */}
      <img src={logoSvg} alt="Logo" width="160" height="180" />
      <span className="text-3xl font-semibold"></span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
