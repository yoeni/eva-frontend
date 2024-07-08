
export const timeAgo = (timestamp: number) =>  {
    const current = Date.now();
    const previous = new Date(timestamp).getTime();
    const elapsed =  current - previous;
  
    const seconds = 60000;
    const minutes = Math.floor(elapsed / seconds);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (elapsed < 60000) { // Less than a minute
        return 'now';
    } else if (minutes < 60) { // Less than an hour
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) { // Less than a day
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 30) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (months < 12 ) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

export const timeAgoFromString = (date: string) => {
    return timeAgo((new Date(date)).getTime());
}