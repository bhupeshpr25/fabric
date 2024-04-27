// define member interface
export interface Member {
	login: string;
	avatar_url: string;
	html_url: string;
}

// fetch members from the API
export async function fetchMembers(): Promise<Member[]> {
	const response = await fetch('https://api.github.com/orgs/mozilla/members?page=1');
	if (!response.ok) {
		throw new Error('Failed to fetch members');
	}
	const data: Member[] = await response.json();
	// console.log(data);
	return data;
}
