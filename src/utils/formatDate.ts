export const formatDateString = (dateString: string | undefined) => {
    if (!dateString) {
      return "";
    }
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }