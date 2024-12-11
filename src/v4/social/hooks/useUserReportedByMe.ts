import { UserRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

const useUserReportedByMe = (userId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['asc-uikit', 'UserRepository', 'isUserReportedByMe', userId],
    queryFn: () => {
      return UserRepository.isUserFlaggedByMe(userId as string);
    },
    enabled: userId != null,
  });

  return {
    isReportedByMe: data,
    isLoading,
  };
};

export default useUserReportedByMe;
