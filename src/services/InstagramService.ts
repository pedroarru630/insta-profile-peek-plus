
interface InstagramProfile {
  username: string;
  full_name?: string;
  profile_pic_url: string;
  exists: boolean;
}

interface ApifyProfileData {
  username: string;
  fullName?: string;
  profilePicUrlHD: string;
}

interface ApifyResponse {
  data: {
    items: ApifyProfileData[];
  };
}

export class InstagramService {
  private static APIFY_API_URL = 'https://api.apify.com/v2/actor-tasks/chatty_coaster~instagram-scraper-task/run-sync?token=apify_api_Tk435sUb2WnBllXsxxfNQaBLkHSZyz0HLRCO';

  static async getProfile(username: string): Promise<InstagramProfile> {
    try {
      console.log('Fetching Instagram profile for:', username);
      
      const cleanUsername = username.replace('@', '');
      
      const response = await fetch(this.APIFY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addParentData: false,
          enhanceUserSearchWithFacebookPage: false,
          isUserReelFeedURL: false,
          isUserTaggedFeedURL: false,
          resultsLimit: 200,
          resultsType: "posts",
          search: cleanUsername,
          searchLimit: 1,
          searchType: "user"
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseJson: ApifyResponse = await response.json();
      console.log('Apify API response:', responseJson);

      const items = responseJson.data?.items || [];

      if (items.length === 0) {
        console.log('No profile data returned from API');
        return {
          username: cleanUsername,
          full_name: undefined,
          profile_pic_url: '/placeholder.svg',
          exists: false
        };
      }

      const profileData = items[0];
      console.log('Profile data found:', profileData);
      
      return {
        username: profileData.username || cleanUsername,
        full_name: profileData.fullName,
        profile_pic_url: profileData.profilePicUrlHD || '/placeholder.svg',
        exists: true
      };
      
    } catch (error) {
      console.error('Error fetching Instagram profile:', error);
      return {
        username: username.replace('@', ''),
        full_name: undefined,
        profile_pic_url: '/placeholder.svg',
        exists: false
      };
    }
  }
}
