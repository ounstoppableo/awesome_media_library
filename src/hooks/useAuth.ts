export default async function useAuth(Authorization: string) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  try {
    const authRes: any = await (
      await fetch(process.env.AUTH_ADDR as string, {
        headers: {
          token: Authorization,
        } as any,
      })
    ).json();
    if (authRes.code === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err: any) {
    return false;
  }
}
