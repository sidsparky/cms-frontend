export function useRole() {
  const token = localStorage.getItem('cms_token')

  if (!token) return { role: null, isSparksLab: false, isClient: false }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('Role from token:', payload.role) // add this line
    const role = payload.role

    return {
      role,
      isSparksLab: role === 'sparkslab',
      isClient:    role === 'client',
    }
  } catch {
    return { role: null, isSparksLab: false, isClient: false }
  }
}